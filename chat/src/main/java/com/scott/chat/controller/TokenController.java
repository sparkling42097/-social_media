package com.scott.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.scott.chat.service.TokenService;
import com.scott.chat.model.Member;
import com.scott.chat.repository.MemberRepository;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/token")
public class TokenController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MemberRepository memberRepository;
    
    // 用於生成密碼重置的 Token
    
    @PostMapping("/generate/{email}")
    public ResponseEntity<Map<String, String>> generateResetToken(@PathVariable String email) {
        try {
            String token = tokenService.generatePasswordResetToken(email);
            // 返回 JSON 格式的 Map
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", "無法生成重置密碼 Token"));
        }
    }
    // 用於檢查 Token 是否有效
    @GetMapping("/validate/{token}")
    public boolean validateToken(@PathVariable String token) {
        return tokenService.validateToken(token);
    }

    // 用於通過 Token 查找相關會員
    @GetMapping("/member/{token}")
    public Member getMemberByToken(@PathVariable String token) {
        return tokenService.getMemberByToken(token).orElseThrow(() -> new RuntimeException("Token not valid"));
    }

   

  
    
}

