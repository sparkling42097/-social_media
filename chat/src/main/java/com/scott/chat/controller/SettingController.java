package com.scott.chat.controller;

import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.scott.chat.model.Member;
import com.scott.chat.service.SettingService;

@RestController
public class SettingController {
    @Autowired
    private SettingService settingService;
    
    @GetMapping("/api/member/current")
    public ResponseEntity<Member> getCurrentMember() {
       Authentication auth = SecurityContextHolder.getContext().getAuthentication();
       String email = auth.getName();
       Member member = settingService.findByEmail(email);
       
       if(member.getMemberphoto() != null) {
           member.setMemberphotobase64(Base64.getEncoder().encodeToString(member.getMemberphoto()));
       }
       
       return ResponseEntity.ok(member);
    }

    @PostMapping("/api/member/update") 
    public ResponseEntity<Member> updateMember(@RequestBody Map<String, String> updates, Authentication auth) {
       String email = auth.getName();
       Member member = settingService.findByEmail(email);
       
       if (member != null) {
           if (updates.containsKey("membername")) {
               member.setMembername(updates.get("membername"));
           }
           if (updates.containsKey("introduce")) {
               member.setIntroduce(updates.get("introduce")); 
           }
           if (updates.containsKey("gender")) {
               member.setGender(updates.get("gender"));
           }
           if (updates.containsKey("birthday")) {
               member.setBirthday(updates.get("birthday"));
           }
           if (updates.containsKey("telephone")) {
               member.setTelephone(updates.get("telephone"));
           }
           
           settingService.save(member);
           if(member.getMemberphoto() != null) {
               member.setMemberphotobase64(Base64.getEncoder().encodeToString(member.getMemberphoto()));
           }
           return ResponseEntity.ok(member);
       }
       return ResponseEntity.notFound().build();
    }

    @PostMapping("/api/member/update-photo")
    public ResponseEntity<Member> updatePhoto(@RequestParam("memberphotofile") MultipartFile file, Authentication auth) {
       try {
           String email = auth.getName();
           Member member = settingService.findByEmail(email);
           
           if (member != null) {
               member.setMemberphotofile(file);
               settingService.save(member);
               if(member.getMemberphoto() != null) {
                   member.setMemberphotobase64(Base64.getEncoder().encodeToString(member.getMemberphoto()));
               }
               return ResponseEntity.ok(member);
           }
           return ResponseEntity.notFound().build();
       } catch (Exception e) {
           return ResponseEntity.internalServerError().build();
       }
    }
    
}

