package com.scott.chat.service;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import com.scott.chat.model.Messagelog;
import com.scott.chat.repository.PostFileRepository;
import com.scott.chat.util.MessageFileUpdatedEvent;

import jakarta.transaction.Transactional;

@Service
public class MessagelogService {
	
	@Autowired
    private PostFileRepository postFileRepository;
	
	private final ApplicationEventPublisher eventPublisher;
	
	@Autowired
    public MessagelogService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }
	
	public String getPostData(Integer postId) {
		byte[] data = postFileRepository.findBysupermessagelogid(postId)
        .map(Messagelog::getMessagefile) // 取得 data 欄位內容
        .orElse(new byte[0]); // 如果找不到該貼文，建立空陣列
		
		// 先把 byte[] 轉回 Base64 字串
		String bordData = new String(data, StandardCharsets.UTF_8);
		
		
        return bordData;
    }
	
	public void notifyMessageFileUpdated(Integer supermessagelogid) {
        // 直接發送事件，通知 WebSocket
        eventPublisher.publishEvent(new MessageFileUpdatedEvent(this, supermessagelogid));
    }
}
