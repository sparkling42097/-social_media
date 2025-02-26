package com.scott.chat.controller;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scott.chat.model.MemberDTO;
import com.scott.chat.repository.MemberRepository;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getMember(@PathVariable Integer id) {
        return memberRepository.findById(id)
            .map(member -> {
                Map<String, Object> response = new HashMap<>();
                response.put("membername", member.getMembername());
                response.put("memberphoto", member.getMemberphoto() != null ? 
                    Base64.getEncoder().encodeToString(member.getMemberphoto()) : null);
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/forchat/{id}")
    public ResponseEntity<MemberDTO> getMember2(@PathVariable Integer id) {
        return memberRepository.findById(id)
            .map(member -> ResponseEntity.ok(new MemberDTO(member)))
            .orElse(ResponseEntity.notFound().build());
    }
}