package com.scott.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import com.scott.chat.model.Member;
import com.scott.chat.model.PasswordReset;

import com.scott.chat.repository.TokenRepository;
import com.scott.chat.util.BCrypt;
import com.scott.chat.repository.MemberRepository;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class TokenService {

    @Autowired
    private EmailService emailService;
	
    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MemberService memberService;

    // 根據 email 查找會員的 memberId
    public Integer getMemberIdByEmail(String email) {
        Optional<Member> memberOpt = memberRepository.findByEmail(email);
        return memberOpt.map(Member::getMemberid).orElse(null); // 返回 memberId 或 null
    }

    // 生成密碼重置的 Token
    public String generatePasswordResetToken(String email) {
        Optional<Member> memberOpt = memberRepository.findByEmail(email);
        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            // 生成唯一的 Token
            String token = UUID.randomUUID().toString();
            // 設定過期時間為 1 小時
            Date expiryDate = new Date(System.currentTimeMillis() + 3600 * 1000); // 1 小時後過期
            Date createdAt = new Date();

            // 創建新的 Token 記錄
            PasswordReset tokenRecord = new PasswordReset(token, member, expiryDate, createdAt);
            tokenRepository.save(tokenRecord);

            // 發送郵件
            emailService.sendPasswordResetEmail(member.getEmail(), token);

            return token;
        } else {
            throw new RuntimeException("Member not found.");
        }
    }

    // 檢查 Token 是否有效
    public boolean validateToken(String token) {
        Optional<PasswordReset> tokenRecordOpt = tokenRepository.findByToken(token);
        if (tokenRecordOpt.isPresent()) {
        	PasswordReset tokenRecord = tokenRecordOpt.get();
            return !tokenRecord.isExpired();
        }
        return false;
    }

    // 根據 Token 找到相關會員
    public Optional<Member> getMemberByToken(String token) {
        Optional<PasswordReset> tokenRecordOpt = tokenRepository.findByToken(token);
        if (tokenRecordOpt.isPresent() && !tokenRecordOpt.get().isExpired()) {
            return Optional.of(tokenRecordOpt.get().getMember());
        }
        return Optional.empty();
    }

    // 清除過期的 Token
    @Transactional
    public void cleanupExpiredTokens() {
        Date currentDate = new Date();
        tokenRepository.deleteByExpiryDateBefore(currentDate);
    }

    // 根據 Token 更新會員的密碼
    @Transactional
    public boolean updatePasswordByToken(String token, String newPassword) {
        if (token == null || newPassword == null) {
            System.out.println("Token 或密碼為空");
            return false;
        }

        return tokenRepository.findByToken(token)
                .filter(tokenRecord -> !tokenRecord.isExpired())
                .map(tokenRecord -> {
                    Member member = tokenRecord.getMember();
                    memberService.updatePassword(member, newPassword);
                    tokenRepository.delete(tokenRecord);
                    System.out.printf("密碼更新成功，會員 ID：{}", member.getMemberid());
                    return true;
                })
                .orElse(false);
    }
}

