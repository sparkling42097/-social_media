package com.scott.chat.model;

public class ChatroomDTO {
    private Integer chatroomid;
    private Integer membera;
    private Integer memberb;
    private String status;
    
    public ChatroomDTO(Chatroom chatroom) {
        this.chatroomid = chatroom.getChatroomid();
        this.membera = chatroom.getMembera();
        this.memberb = chatroom.getMemberb();
        this.status = chatroom.getStatus();
    }
    
    // Getters and Setters
    public Integer getChatroomid() {
        return chatroomid;
    }
    
    public void setChatroomid(Integer chatroomid) {
        this.chatroomid = chatroomid;
    }
    
    public Integer getMembera() {
        return membera;
    }
    
    public void setMembera(Integer membera) {
        this.membera = membera;
    }
    
    public Integer getMemberb() {
        return memberb;
    }
    
    public void setMemberb(Integer memberb) {
        this.memberb = memberb;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}