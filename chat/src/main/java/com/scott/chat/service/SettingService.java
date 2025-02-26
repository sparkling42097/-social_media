package com.scott.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.scott.chat.model.Member;
import com.scott.chat.repository.SettingRepository;

@Service
public class SettingService {
    @Autowired
    private SettingRepository settingRepository;
    
    public Member findByEmail(String email) {
        return settingRepository.findByEmail(email);
    }
    
    public void save(Member member) {
        settingRepository.save(member);
    }
}