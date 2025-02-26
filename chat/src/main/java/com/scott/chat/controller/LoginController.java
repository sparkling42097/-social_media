package com.scott.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.scott.chat.model.Member;
import com.scott.chat.service.MemberService;
import com.scott.chat.util.BCrypt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;



@Controller
@SessionAttributes("member") //多次請求
public class LoginController {
	@Autowired
	private MemberService memberService;

	
	//註冊
	@RequestMapping("/registerpage")
	public String reg(Model model) {
		Member member = new Member();
		model.addAttribute("member", member);
		return "registerpage";
	}
	
	@PostMapping("/reg_submit")
	public String regSubmit(@ModelAttribute Member member, 
	        BindingResult result, Model model) {
	    
	    Member existingMember = memberService.findMemberByAccount(member.getEmail());
	    
	    if (existingMember != null) {
	        model.addAttribute("error", "帳號已經存在，請選擇其他帳號"); //帳號已存在
	        return "registerpage"; // 返回註冊頁面
	    }
	    
	    /* 表單錯誤
	    if (result.hasErrors()) {
	        System.out.println(result.getAllErrors().toString());
	        return "registerpage";
	    }*/

	    memberService.addMember(member);//新增註冊會員

	   
	    return "redirect:/loginpage";   // 返回登錄頁面
	}
	
	
	 @GetMapping("/loginpage")
	    public String login(Model model, HttpServletRequest request) {
	        // 檢查用戶是否已經登錄
	        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	        if (authentication != null && authentication.isAuthenticated() 
	                && !authentication.getPrincipal().equals("anonymousUser")) {
	            return "redirect:/main"; // 已登錄，重定向到主頁
	        }

	        // 檢查是否有錯誤訊息
	        Object error = request.getAttribute("error");
	        if (error != null) {
	            model.addAttribute("error", error);  // 將 error 設置為 model 屬性
	            System.out.println("Adding error to model: " + error);
	        }

	        // 如果 model 中還沒有 member 物件，創建一個新的
	        if (!model.containsAttribute("member")) {
	            model.addAttribute("member", new Member());
	        }

	        return "loginpage"; // 繼續展示登錄頁
	    }

	    @PostMapping("/loginpage")
	    public String loginpage(@ModelAttribute Member member) {
	        return "loginpage";
	    }
	
	
	
	
	
	@GetMapping("/main")
	public String mainPage(HttpSession session, HttpServletResponse response, Model model) {
	    // 檢查是否有登錄信息
	    if (session.getAttribute("member") == null) {
	        // 如果沒有登錄，重定向到登錄頁面
	        return "redirect:/loginpage";
	    }else {
	    	Member member = (Member) session.getAttribute("member");
	    	member.setMemberphoto(member.getMemberphoto());
	    	model.addAttribute("member", member);
	    }
	    
	    return "search";//有session
	}
	
		//登出
	
		
	@GetMapping("/forgotPassword")
	public String showForgotPasswordPage() {
	    return "forgotPassword"; 
	}

	@GetMapping("/chat")
	public String showchat() {
	    return "chat"; 
	}
	
	
	@GetMapping("/Friend Request Page")
	public String friendRequestPage() {
	    return "Friend Request Page"; 
	}
	
	
}
