package com.scott.chat.service;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scott.chat.model.Post;
import com.scott.chat.repository.LikeRepository;
import com.scott.chat.repository.SearchRepository;

@Service
public class LikeService {
    private static final Logger logger = Logger.getLogger(LikeService.class.getName());
    
    @Autowired
    private SearchRepository searchRepository;
    
    @Transactional
    public Integer updateLikeCount(Integer postId, boolean isLiking) {
        try {
            logger.info("處理按讚請求 - 貼文ID: " + postId);
            
            Post post = searchRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("找不到指定的貼文，ID: " + postId));
            
            Integer currentLikes = post.getLikedcount();
            if (currentLikes == null) {
                currentLikes = 0;
            }
            
            // 根據前端傳來的狀態決定是增加還是減少
            if (isLiking) {
                post.setLikedcount(currentLikes + 1);
            } else {
                post.setLikedcount(Math.max(0, currentLikes - 1));
            }
            
            Post savedPost = searchRepository.save(post);
            Integer newLikeCount = savedPost.getLikedcount();
            
            logger.info("按讚處理成功 - 貼文ID: " + postId + ", 新的按讚數: " + newLikeCount);
            return newLikeCount;
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "處理按讚請求時發生錯誤 - 貼文ID: " + postId, e);
            throw new RuntimeException("處理按讚請求失敗", e);
        }
    }
}