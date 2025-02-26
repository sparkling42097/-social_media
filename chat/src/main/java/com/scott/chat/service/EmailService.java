package com.scott.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    
    public void sendPasswordResetEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("w5030622@gmail.com");  // 用你的發件人郵箱
        message.setTo(toEmail);  // 收件人是發送請求的使用者郵箱
        message.setSubject("重置密碼");// 標題
        message.setText("請點擊以下網址重置您的密碼:\n" + 
                         "http://localhost:8080/reset-password?token=" + token);

        mailSender.send(message);
    }
    
}

