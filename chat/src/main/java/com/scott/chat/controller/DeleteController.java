package com.scott.chat.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scott.chat.model.Member;
import com.scott.chat.service.DeleteService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/delete")
public class DeleteController {
    
    @Autowired
    private DeleteService deleteService;
    
    @PostMapping("/posts")
    public ResponseEntity<?> deletePosts(@RequestBody Map<String, List<Integer>> request, HttpSession session) {
        try {
            Member member = (Member) session.getAttribute("member");
            if (member == null) {
                return ResponseEntity.status(401).body("請先登入");
            }
            
            List<Integer> postIds = request.get("postIds");
            deleteService.deletePosts(postIds, member.getMemberid());
            return ResponseEntity.ok().body("刪除成功");
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("刪除操作失敗: " + e.getMessage());
        }
    }
}


