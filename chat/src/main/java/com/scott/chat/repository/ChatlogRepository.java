package com.scott.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.scott.chat.model.Chatlog;
import java.util.List;

@Repository
public interface ChatlogRepository extends JpaRepository<Chatlog, Integer> {
	@Query("SELECT c FROM Chatlog c WHERE c.chatroom.chatroomid = :chatroomId ORDER BY c.inputtime ASC")
    List<Chatlog> findByChatroomidOrderByInputtimeAsc(@Param("chatroomId") Integer chatroomid);
}