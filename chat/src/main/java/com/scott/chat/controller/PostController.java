package com.scott.chat.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.scott.chat.model.Member;
import com.scott.chat.model.Post;
import com.scott.chat.service.PostPhotoService;
import com.scott.chat.service.PostService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;
    @Autowired
    private PostPhotoService postPhotoService;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            HttpSession session) {
        try {
            Member member = (Member) session.getAttribute("member");
            if (member == null) {
                return ResponseEntity.status(401).body("請先登入");
            }

            Post post = new Post();
            post.setPosterid(member.getMemberid());
            post.setPostcontent(content);
            Post savedPost = postService.createPost(post);

            if (images != null) {
                for (MultipartFile image : images) {
                    postPhotoService.savePostPhoto(savedPost.getPostid(), image);
                }
            }

            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("發布失敗: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPostsOrderByTime());
    }
    
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPost(@PathVariable Integer postId) {
        try {
            Post post = postService.findById(postId);
            if (post == null) {
                return ResponseEntity.notFound().build();
            }
            
            // 建立包含所需資訊的回應
            Map<String, Object> response = new HashMap<>();
            response.put("postId", post.getPostid());
            response.put("content", post.getPostcontent());
            response.put("likeCount", post.getLikedcount());
            response.put("messageCount", post.getMessagecount());
            response.put("postTime", post.getPosttime());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "獲取貼文資訊失敗: " + e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPosts(@PathVariable Integer userId) {
        List<Post> posts = postService.findByPosterid(userId);
        return ResponseEntity.ok(posts);
    }
}