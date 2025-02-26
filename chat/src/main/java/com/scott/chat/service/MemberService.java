package com.scott.chat.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import com.scott.chat.model.Member;
import com.scott.chat.repository.MemberRepository;


@Service
public class MemberService {
	@Autowired
	private MemberRepository memberRepository;
		
	private final BCryptPasswordEncoder passwordEncoder= new BCryptPasswordEncoder();
	 // 讀取默認頭像
    private byte[] getDefaultPhoto() {
        try {
            // 從資源文件夾讀取默認圖片
            ClassPathResource resource = new ClassPathResource("static/images/default-avatar.png");
            return StreamUtils.copyToByteArray(resource.getInputStream());
        } catch (IOException e) {
            // 如果讀取失敗，返回一個空的 byte 數組
            return new byte[0];
        }
    }
	
	
	//新增會員
	public void addMember(Member member) {
		member.setPassword(passwordEncoder.encode(member.getPassword()));
		member.setPostcount(0); // 如果 Post_count 是 null，則設為 0
		member.setTelephone("090000000");
	    member.setBirthday("2000-01-01");
	    member.setGender("男");
		
	    
	 // 設定默認頭像
        if (member.getMemberphoto() == null) {
            member.setMemberphoto(getDefaultPhoto());
        }
		
		memberRepository.save(member);
	}
	
	 // 驗證密碼
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
	
	//根據帳號查詢會員
	public Member findMemberByAccount(String email) {
        return memberRepository.findByEmail(email).orElse(null);
    }
	//更新密碼
	public void updatePassword(Member member, String newPassword) {
        member.setPassword(passwordEncoder.encode(newPassword));
        memberRepository.save(member);
    }
	
}
