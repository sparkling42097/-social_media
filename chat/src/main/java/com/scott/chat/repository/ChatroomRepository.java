package com.scott.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.scott.chat.model.Chatroom;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatroomRepository extends JpaRepository<Chatroom, Integer> {
    List<Chatroom> findByMemberaOrMemberb(Integer membera, Integer memberb);
    
    // 查詢待處理的好友請求（確保只查詢 memberb 是接收者的請求）
    @Query("SELECT c FROM Chatroom c WHERE c.status = 'ask' AND c.memberb = :userId")
    List<Chatroom> findPendingRequests(@Param("userId") Integer userId);
    
    // 查詢是否存在任何關係（無論方向）
    @Query("SELECT c FROM Chatroom c WHERE (c.membera = :user1 AND c.memberb = :user2) OR (c.membera = :user2 AND c.memberb = :user1)")
    Optional<Chatroom> findExistingChatroom(@Param("user1") Integer user1, @Param("user2") Integer user2);
}