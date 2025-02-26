package com.scott.chat.controller;

import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.scott.chat.model.Member;
import com.scott.chat.service.LikeService;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/likes")
public class LikeController {
    private static final Logger logger = Logger.getLogger(LikeController.class.getName());
    
    @Autowired
    private LikeService likeService;
    
    @PutMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> updateLikeCount(
            @PathVariable Integer postId,
            @RequestParam boolean isLiking,
            HttpSession session,
            Authentication authentication) {
        try {
            // 檢查是否已登入
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                   .body(Map.of("error", "請先登入"));
            }
            
            // 從 session 獲取會員資訊
            Member member = (Member) session.getAttribute("member");
            if (member == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                   .body(Map.of("error", "請先登入"));
            }
            
            // 使用正確的方法名
            Integer newLikeCount = likeService.updateLikeCount(postId, isLiking);
            
            Map<String, Object> response = new HashMap<>();
            response.put("likeCount", newLikeCount);
            response.put("isLiked", isLiking);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "處理按讚請求時發生錯誤 - 貼文ID: " + postId, e);
            return ResponseEntity.internalServerError()
                               .body(Map.of("error", "處理按讚請求失敗"));
        }
    }
}