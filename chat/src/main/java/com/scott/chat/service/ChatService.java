package com.scott.chat.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.scott.chat.model.Chatlog;
import com.scott.chat.model.Chatroom;
import com.scott.chat.model.ChatroomDTO;
import com.scott.chat.model.Member;
import com.scott.chat.repository.ChatlogRepository;
import com.scott.chat.repository.ChatroomRepository;
import com.scott.chat.repository.MemberRepository;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);
    
    @Autowired
    private ChatroomRepository chatroomRepository;
    
    @Autowired
    private ChatlogRepository chatlogRepository;

    @Autowired
    private MemberRepository memberRepository;

    public Chatroom createChatroom(Integer membera, Integer memberb) {
        Chatroom room = new Chatroom();
        room.setMembera(membera);
        room.setMemberb(memberb);
        return chatroomRepository.save(room);
    }

    public List<ChatroomDTO> getUserChatrooms(Integer userId) {
        return chatroomRepository.findByMemberaOrMemberb(userId, userId)
            .stream()
            .map(ChatroomDTO::new)
            .collect(Collectors.toList());
    }

    public Chatlog saveMessage(Chatlog message) {
        log.info("準備儲存訊息: {}", message);
        
        // 處理 chatroom 關聯
        Chatroom chatroom = chatroomRepository.findById(message.getChatroomid())
            .orElseThrow(() -> new RuntimeException("找不到聊天室"));
        message.setChatroom(chatroom);
        
        // 處理 sender 關聯
        Member sender = memberRepository.findById(message.getSenderid())
            .orElseThrow(() -> new RuntimeException("找不到發送者"));
        message.setMember(sender);
        
        // 設置時間
        message.setInputtime(LocalDateTime.now().toString());
        
        try {
            Chatlog saved = chatlogRepository.save(message);
            log.info("訊息儲存成功: {}", saved);
            return saved;
        } catch (Exception e) {
            log.error("儲存訊息時發生錯誤", e);
            throw e;
        }
    }

    public List<Chatlog> getChatHistory(Integer chatroomId) {
        return chatlogRepository.findByChatroomidOrderByInputtimeAsc(chatroomId);
    }

    
}