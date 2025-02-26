package com.scott.chat.util;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.socket.WebSocketHandler;

@Component
public class MessageFileChangeListener {
	
	@TransactionalEventListener
    public void onMessageFileUpdated(MessageFileUpdatedEvent event) {
        Integer supermessagelogid = event.getsupermessagelogid();
        
        // 在控制台顯示變動的 ID
        System.out.println("MessageFile 更新 - supermessagelogid: " + supermessagelogid);
    }
}
