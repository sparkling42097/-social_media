package com.scott.chat.util;

import java.util.List;

public class PostDTO {
    private Integer postId;
    private String content;
    private String postTime;
    private Integer likeCount;
    private Integer messageCount;  // 新增留言數欄位
    private List<String> photoUrls;
    private String memberName;
    
    // Getters 和 Setters
    public Integer getPostId() {
        return postId;
    }
    
    public void setPostId(Integer postId) {
        this.postId = postId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getPostTime() {
        return postTime;
    }
    
    public void setPostTime(String postTime) {
        this.postTime = postTime;
    }
    
    public Integer getLikeCount() {
        return likeCount;
    }
    
    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }
    
    public Integer getMessageCount() {
        return messageCount;
    }
    
    public void setMessageCount(Integer messageCount) {
        this.messageCount = messageCount;
    }
    
    public List<String> getPhotoUrls() {
        return photoUrls;
    }
    
    public void setPhotoUrls(List<String> photoUrls) {
        this.photoUrls = photoUrls;
    }
    
    public String getMemberName() {
        return memberName;
    }
    
    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }
}