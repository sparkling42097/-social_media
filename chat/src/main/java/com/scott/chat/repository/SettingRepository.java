package com.scott.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.scott.chat.model.Member;

public interface SettingRepository extends JpaRepository<Member, Integer> {
    Member findByEmail(String email);
}
