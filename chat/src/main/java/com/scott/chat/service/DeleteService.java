package com.scott.chat.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.scott.chat.model.Member;
import com.scott.chat.repository.DeleteRepository;
import com.scott.chat.repository.MemberRepository;
import com.scott.chat.repository.PostRepository;

import jakarta.transaction.Transactional;

@Service
public class DeleteService {

    @Autowired
    private DeleteRepository deleteRepository;
    
    @Autowired
    private MemberRepository memberRepository;

    @Transactional
    public void deletePosts(List<Integer> postIds, Integer memberId) {
        // 驗證貼文所有權
        Long unauthorizedCount = deleteRepository.countPostsByOtherUser(postIds, memberId);
        if (unauthorizedCount > 0) {
            throw new RuntimeException("包含無權刪除的貼文");
        }
        
        // 刪除相關照片記錄
        deleteRepository.deletePhotosByPostIds(postIds);
        
        // 刪除貼文
        deleteRepository.deletePostsByIds(postIds, memberId);
        
        // 更新用戶貼文數
        Member member = memberRepository.findById(memberId).orElse(null);
        if (member != null && member.getPostcount() != null) {
            member.setPostcount(Math.max(0, member.getPostcount() - postIds.size()));
            memberRepository.save(member);
        }
    }
}