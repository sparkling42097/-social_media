package com.scott.chat.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scott.chat.model.Post;

@Repository
public interface SearchRepository extends JpaRepository<Post, Integer> {
    @Query(value = """
        SELECT DISTINCT p.* 
        FROM post p 
        LEFT JOIN postphoto pp ON p.postid = pp.postid 
        LEFT JOIN member m ON p.posterid = m.memberid 
        WHERE (:keyword IS NULL OR 
            LOWER(p.post_content) LIKE CONCAT('%', LOWER(:keyword), '%') OR 
            LOWER(m.member_name) LIKE CONCAT('%', LOWER(:keyword), '%'))
        GROUP BY p.postid, p.post_time 
        ORDER BY p.post_time DESC
        """,
        countQuery = """
        SELECT COUNT(DISTINCT p.postid) 
        FROM post p 
        LEFT JOIN postphoto pp ON p.postid = pp.postid 
        LEFT JOIN member m ON p.posterid = m.memberid 
        WHERE (:keyword IS NULL OR 
            LOWER(p.post_content) LIKE CONCAT('%', LOWER(:keyword), '%') OR 
            LOWER(m.member_name) LIKE CONCAT('%', LOWER(:keyword), '%'))
        """,
        nativeQuery = true)
    Page<Post> findPostsWithPhotosByKeywordOrMemberName(
        @Param("keyword") String keyword,
        Pageable pageable
    );
}