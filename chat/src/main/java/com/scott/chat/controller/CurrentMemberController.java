package com.scott.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.Base64;
import com.scott.chat.model.Member;
import com.scott.chat.repository.MemberRepository;
import com.scott.chat.repository.PostRepository;
import com.scott.chat.service.SettingService;

@RestController
@RequestMapping("/api/member/profile")
public class CurrentMemberController {
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private SettingService settingService;
    
    @Autowired
    private PostRepository postRepository;  // 新增

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentMember(HttpSession session) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.status(401).body("未登入");
        }
        
        String email = auth.getName();
        Member member = settingService.findByEmail(email);
        
        if (member != null) {
            // 獲取最新貼文數
            Integer postCount = postRepository.countByPosterid(member.getMemberid());
            member.setPostcount(postCount);
            memberRepository.save(member);
            
            if (member.getMemberphoto() != null) {
                member.setMemberphotobase64(Base64.getEncoder().encodeToString(member.getMemberphoto()));
            }
            session.setAttribute("member", member);
            return ResponseEntity.ok(member);
        }
        
        return ResponseEntity.notFound().build();
    }
}
