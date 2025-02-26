package com.scott.chat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.scott.chat.model.Post;

public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByPosterid(Integer posterid);
    Integer countByPosterid(Integer posterid);
    
    @Query("SELECT p FROM Post p ORDER BY p.posttime DESC") 
    List<Post> findAllOrderByPostTimeDesc();
    
}
