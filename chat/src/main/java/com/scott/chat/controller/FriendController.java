package com.scott.chat.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import com.scott.chat.model.Chatroom;
import com.scott.chat.model.ChatroomDTO;
import com.scott.chat.model.Member;
import com.scott.chat.repository.MemberRepository;
import com.scott.chat.service.FriendRequestService;

@RestController
@RequestMapping("/api/friend")
public class FriendController {
    
    @Autowired
    private FriendRequestService friendRequestService;
    
    @Autowired
    private MemberRepository memberRepository;

    // 發送好友請求
    @PostMapping("/send/{receiverId}")
    public ResponseEntity<?> sendRequest(
            @PathVariable Integer receiverId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            // 驗證接收者是否存在
            Optional<Member> receiverOptional = memberRepository.findById(receiverId);
            if (receiverOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("接收者不存在");
            }

            // 獲取發送者資訊
            Optional<Member> senderOptional = memberRepository.findByEmail(userDetails.getUsername());
            if (senderOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("發送者資訊無效");
            }

            // 確認不是自己加自己
            if (senderOptional.get().getMemberid().equals(receiverId)) {
                return ResponseEntity.badRequest().body("不能加自己為好友");
            }

            // 發送好友請求
            Chatroom chatroom = friendRequestService.sendFriendRequest(
                senderOptional.get().getMemberid(),
                receiverId
            );
            
            // 轉換為 DTO 避免循環引用
            return ResponseEntity.ok(new ChatroomDTO(chatroom));
            
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("處理請求時發生錯誤");
        }
    }

    // 獲取待處理的好友請求
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            // 獲取當前用戶
            Optional<Member> memberOptional = memberRepository.findByEmail(userDetails.getUsername());
            if (memberOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("用戶資訊無效");
            }

            // 獲取待處理請求
            List<Chatroom> requests = friendRequestService.getPendingFriendRequests(
                memberOptional.get().getMemberid()
            );
            
            // 轉換為 DTO List
            return ResponseEntity.ok(
                requests.stream()
                    .map(ChatroomDTO::new)
                    .toList()
            );
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("獲取待處理請求時發生錯誤");
        }
    }

    // 接受好友請求
    @PostMapping("/accept/{chatroomId}")
    public ResponseEntity<?> acceptRequest(
            @PathVariable Integer chatroomId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            // 獲取當前用戶
            Optional<Member> memberOptional = memberRepository.findByEmail(userDetails.getUsername());
            if (memberOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("用戶資訊無效");
            }

            // 接受請求
            Chatroom updatedChatroom = friendRequestService.acceptFriendRequest(
                chatroomId,
                memberOptional.get().getMemberid()
            );
            
            // 轉換為 DTO
            return ResponseEntity.ok(new ChatroomDTO(updatedChatroom));
            
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("處理接受請求時發生錯誤");
        }
    }

    // 拒絕好友請求
    @PostMapping("/reject/{chatroomId}")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Integer chatroomId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            // 獲取當前用戶
            Optional<Member> memberOptional = memberRepository.findByEmail(userDetails.getUsername());
            if (memberOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("用戶資訊無效");
            }

            // 拒絕請求
            friendRequestService.rejectFriendRequest(
                chatroomId,
                memberOptional.get().getMemberid()
            );
            
            return ResponseEntity.ok().build();
            
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("處理拒絕請求時發生錯誤");
        }
    }
}
