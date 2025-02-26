package com.scott.chat.security;

import java.io.IOException;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {
    
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
	        AuthenticationException exception) throws IOException, ServletException {
	    String errorMessage;
	    if (exception instanceof BadCredentialsException) {
	        errorMessage = "帳號或密碼錯誤";
	    } else {
	        errorMessage = "登入失敗";
	    }
	    
	    // 使用 model 而非 request 直接設置錯誤訊息
	    request.setAttribute("error", errorMessage);
	    request.getRequestDispatcher("/loginpage").forward(request, response);
	}
}
