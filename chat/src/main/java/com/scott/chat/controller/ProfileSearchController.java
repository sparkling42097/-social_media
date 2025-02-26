package com.scott.chat.controller;

import java.util.logging.Logger;
import java.util.logging.Level;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scott.chat.service.ProfileSearchService;
import com.scott.chat.util.PostDTO;

@RestController
@RequestMapping("/api/profile/search")
public class ProfileSearchController {
    private static final Logger logger = Logger.getLogger(ProfileSearchController.class.getName());
    
    @Autowired
    private ProfileSearchService profileSearchService;
    
    @GetMapping("/photos")
    public ResponseEntity<Page<PostDTO>> searchUserPhotos(
            @RequestParam Integer posterId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sortBy) {
        
        try {
            logger.info("接收個人貼文搜尋請求 - 用戶ID: " + posterId + ", 關鍵字: " + keyword);
            Page<PostDTO> results = profileSearchService.searchUserPostsWithPhotos(posterId, keyword, page, size, sortBy);
            logger.info("搜尋完成，找到 " + results.getTotalElements() + " 筆結果");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "處理個人貼文搜尋請求時發生錯誤", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}