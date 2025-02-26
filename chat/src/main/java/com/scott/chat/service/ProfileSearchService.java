package com.scott.chat.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.logging.Logger;
import java.util.logging.Level;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scott.chat.model.Post;
import com.scott.chat.model.PostPhoto;
import com.scott.chat.model.Member;
import com.scott.chat.repository.ProfileSearchRepository;
import com.scott.chat.repository.PostPhotoRepository;
import com.scott.chat.repository.MemberRepository;
import com.scott.chat.util.PostDTO;

@Service
public class ProfileSearchService {
    private static final Logger logger = Logger.getLogger(ProfileSearchService.class.getName());
    
    @Autowired
    private ProfileSearchRepository profileSearchRepository;
    
    @Autowired
    private PostPhotoRepository postPhotoRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Transactional(readOnly = true)
    public Page<PostDTO> searchUserPostsWithPhotos(Integer posterId, String keyword, int page, int size, String sortBy) {
        try {
            logger.info("開始搜尋個人貼文，用戶ID: " + posterId + ", 關鍵字: " + (keyword != null ? keyword : "無"));
            
            Page<Post> posts = profileSearchRepository.findUserPostsWithPhotosByKeyword(
                posterId,
                keyword != null ? keyword.trim().toLowerCase() : null,
                PageRequest.of(page, size)
            );
            
            if (posts.isEmpty()) {
                logger.info("沒有找到符合條件的貼文");
                return Page.empty(PageRequest.of(page, size));
            }
            
            List<PostDTO> dtoList = new ArrayList<>();
            for (Post post : posts.getContent()) {
                PostDTO dto = convertToDTO(post);
                if (dto != null && dto.getPhotoUrls() != null && !dto.getPhotoUrls().isEmpty()) {
                    dtoList.add(dto);
                }
            }
            
            return new PageImpl<>(
                dtoList,
                posts.getPageable(),
                posts.getTotalElements()
            );
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "搜尋個人貼文時發生錯誤", e);
            throw new RuntimeException("搜尋處理失敗", e);
        }
    }
    
    // 保留原有的 convertToDTO、processPhotos 等輔助方法
    private PostDTO convertToDTO(Post post) {
        if (post == null) {
            return null;
        }

        try {
            PostDTO dto = createBasicDTO(post);
            
            // 設置會員資訊
            setMemberInfo(dto, post);
            
            // 處理圖片
            List<String> photoUrls = processPhotos(post);
            if (photoUrls.isEmpty()) {
                return null;
            }
            
            dto.setPhotoUrls(photoUrls);
            return dto;
            
        } catch (Exception e) {
            logger.log(Level.SEVERE, "轉換貼文時發生錯誤: " + post.getPostid(), e);
            return null;
        }
    }
    
    private List<String> processPhotos(Post post) {
        List<String> photoUrls = new ArrayList<>();
        try {
            List<PostPhoto> photos = postPhotoRepository.findByPostid(post.getPostid());
            
            if (photos == null || photos.isEmpty()) {
                return photoUrls;
            }

            for (PostPhoto photo : photos) {
                if (photo != null && photo.getPostedphoto() != null) {
                    try {
                        byte[] imageData = photo.getPostedphoto();
                        String base64 = Base64.getEncoder().encodeToString(imageData);
                        photoUrls.add(base64);
                    } catch (Exception e) {
                        logger.log(Level.WARNING, "處理單張圖片時發生錯誤", e);
                    }
                }
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "處理貼文圖片時發生錯誤", e);
        }
        return photoUrls;
    }
    
    private PostDTO createBasicDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setPostId(post.getPostid());
        dto.setContent(post.getPostcontent());
        dto.setPostTime(post.getPosttime());
        dto.setLikeCount(post.getLikedcount());
        dto.setMessageCount(post.getMessagecount());  // 新增這行
        return dto;
    }

    private void setMemberInfo(PostDTO dto, Post post) {
        try {
            Member member = memberRepository.findById(post.getPosterid()).orElse(null);
            if (member != null) {
                dto.setMemberName(member.getMembername());
            } else {
                dto.setMemberName("未知用戶");
            }
        } catch (Exception e) {
            logger.log(Level.WARNING, "查詢會員資訊時發生錯誤", e);
            dto.setMemberName("未知用戶");
        }
    }
}