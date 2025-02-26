package com.scott.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scott.chat.model.Chatroom;
import com.scott.chat.repository.ChatroomRepository;



import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FriendRequestService {
    @Autowired
    private ChatroomRepository chatroomRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public Chatroom sendFriendRequest(Integer senderId, Integer receiverId) {
        // 檢查是否已存在聊天室（檢查雙向關係）
        Optional<Chatroom> existingChatroom = chatroomRepository.findExistingChatroom(senderId, receiverId);
        
        if (existingChatroom.isPresent()) {
            throw new IllegalStateException("已經存在關係");
        }
        
        // 創建新的聊天室 - 直接設置 membera 為發送者，memberb 為接收者
        Chatroom chatroom = new Chatroom();
        chatroom.setMembera(senderId);    // 發送者永遠是 membera
        chatroom.setMemberb(receiverId);   // 接收者永遠是 memberb
        chatroom.setStatus("ask");     // 設置狀態為待確認
        
        chatroom = chatroomRepository.save(chatroom);
        
        // 發送WebSocket通知
        NotificationMessage notification = new NotificationMessage(
            "FRIEND_REQUEST",
            "收到新的好友申請",
            senderId
        );
        messagingTemplate.convertAndSendToUser(
            receiverId.toString(),
            "/queue/notifications",
            notification
        );
        
        return chatroom;
    }

    public List<Chatroom> getPendingFriendRequests(Integer userId) {
        return chatroomRepository.findPendingRequests(userId);
    }

    public Chatroom acceptFriendRequest(Integer chatroomId, Integer userId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId)
            .orElseThrow(() -> new IllegalStateException("找不到該好友請求"));
        
        // 確保只有接收者可以接受請求
        if (!chatroom.getMemberb().equals(userId)) {
            throw new IllegalStateException("無權處理此請求");
        }
        
        chatroom.setStatus("confirm");  // 設置為已接受
        Chatroom savedChatroom = chatroomRepository.save(chatroom);
        
        // 發送接受通知給發送者
        NotificationMessage notification = new NotificationMessage(
            "FRIEND_REQUEST_ACCEPTED",
            "您的好友請求已被接受",
            userId
        );
        messagingTemplate.convertAndSendToUser(
            chatroom.getMembera().toString(),
            "/queue/notifications",
            notification
        );
        
        return savedChatroom;
    }

    public void rejectFriendRequest(Integer chatroomId, Integer userId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId)
            .orElseThrow(() -> new IllegalStateException("找不到該好友請求"));
        
        // 確保只有接收者可以拒絕請求
        if (!chatroom.getMemberb().equals(userId)) {
            throw new IllegalStateException("無權處理此請求");
        }
        
        // 刪除請求
        chatroomRepository.delete(chatroom);
        
        // 發送拒絕通知給發送者
        NotificationMessage notification = new NotificationMessage(
            "FRIEND_REQUEST_REJECTED",
            "您的好友請求已被拒絕",
            userId
        );
        messagingTemplate.convertAndSendToUser(
            chatroom.getMembera().toString(),
            "/queue/notifications",
            notification
        );
    }
}
