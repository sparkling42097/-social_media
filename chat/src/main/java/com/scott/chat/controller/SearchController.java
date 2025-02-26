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

import com.scott.chat.service.SearchService;
import com.scott.chat.util.PostDTO;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private static final Logger logger = Logger.getLogger(SearchController.class.getName());
    
    @Autowired
    private SearchService searchService;
    
    @GetMapping("/photos")
    public ResponseEntity<Page<PostDTO>> searchPhotos(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sortBy) {
        
        try {
            logger.info("接收搜尋請求 - 關鍵字: " + keyword + ", 頁碼: " + page);  // 修改這行
            Page<PostDTO> results = searchService.searchPostsWithPhotos(keyword, page, size, sortBy);
            logger.info("搜尋完成，找到 " + results.getTotalElements() + " 筆結果");  // 修改這行
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "處理搜尋請求時發生錯誤", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}