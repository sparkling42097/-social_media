package com.scott.chat.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.scott.chat.model.Member;
import com.scott.chat.service.MemberService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private MemberService memberService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
            Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        if (email == null || email.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Email not found");
            return;
        }

        // 檢查用戶是否已經存在
        Member existingMember = memberService.findMemberByAccount(email);
        if (existingMember == null) {
            // 創建新會員
            Member newMember = new Member();
            newMember.setEmail(email);
            newMember.setMembername(name);
            newMember.setRealname(name); 
            newMember.setPassword(""); // 密碼為空
            memberService.addMember(newMember);
            existingMember = newMember;
        }

        // 設置 session
        HttpSession session = request.getSession();
        session.setAttribute("member", existingMember);
        
        // 清除可能存在的錯誤訊息
        session.removeAttribute("error");


        // 設置預設的重定向 URL
        setDefaultTargetUrl("/main");
        super.onAuthenticationSuccess(request, response, authentication);
    }
}