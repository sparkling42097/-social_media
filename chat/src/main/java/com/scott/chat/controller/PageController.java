package com.scott.chat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.scott.chat.model.Member;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
public class PageController {
    
	/**
     * 首頁跳轉
     */
    @GetMapping("/home")
    public String showHomePage() {
        return "Home";
    }
    
    /**
     * 搜尋頁面跳轉
     */
    @GetMapping("/search")
    public String showSearchPage(HttpSession session, HttpServletResponse response, Model model) {
    	// 檢查是否有登錄信息
	    if (session.getAttribute("member") == null) {
	        // 如果沒有登錄，重定向到登錄頁面
	        return "redirect:/loginpage";
	    }else {
	    	Member member = (Member) session.getAttribute("member");
	    	member.setMemberphoto(member.getMemberphoto());
	    	model.addAttribute("member", member);
	    }
    	return "search";
    }
    
    /**
     * 個人資料頁面跳轉
     */
    @GetMapping("/profile")
    public String showProfilePage() {
        return "profile";
    }
    
    /**
     * 處理設定頁面的跳轉
     */
    @GetMapping("/settings")
    public String showSettingsPage() {
        return "setting";  // 返回設定頁面
    }
    

}
