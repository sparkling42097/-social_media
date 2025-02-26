package com.scott.chat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.scott.chat.model.Post;

@Repository
public interface DeleteRepository extends JpaRepository<Post, Integer> {
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.postid IN :postIds AND p.posterid != :memberId")
    Long countPostsByOtherUser(List<Integer> postIds, Integer memberId);
    
    @Modifying
    @Query("DELETE FROM PostPhoto pp WHERE pp.postid IN :postIds")
    void deletePhotosByPostIds(List<Integer> postIds);
    
    @Modifying
    @Query("DELETE FROM Post p WHERE p.postid IN :postIds AND p.posterid = :memberId")
    void deletePostsByIds(List<Integer> postIds, Integer memberId);
}
