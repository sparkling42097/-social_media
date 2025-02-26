package com.scott.chat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scott.chat.model.Messagelog;

public interface PostFileRepository extends JpaRepository<Messagelog, Integer> {
	Optional<Messagelog> findBysupermessagelogid(Integer postId);
}
