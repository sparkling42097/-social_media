package com.scott.chat.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.scott.chat.model.PasswordResetRequest;
import com.scott.chat.model.PasswordReset;
import com.scott.chat.service.TokenService;

@Controller
public class PasswordResetController {

	 @Autowired
	    private TokenService tokenService;
	
	 @PostMapping("/reset-password")
	 public String handleResetPassword(
	         @ModelAttribute PasswordResetRequest passwordResetRequest, // 使用 @ModelAttribute 綁定資料
	         Model model) {
	     
	     String token = passwordResetRequest.getToken();
	     String newPassword = passwordResetRequest.getNewPassword();
	    
	     
	     boolean success = tokenService.updatePasswordByToken(token, newPassword);

	     if (success) {
	         return "resetpasswordsuccess"; // 返回成功頁面
	     } else {
	         return "resetpassworderror"; // 返回錯誤頁面
	     }
	 }

	    @GetMapping("/reset-password")
	    public String showResetPasswordPage(@RequestParam("token") String token, Model model) {
	        model.addAttribute("token", token);
	        return "resetpassword"; // 返回重設密碼頁面
	    }
	
    
    
}
