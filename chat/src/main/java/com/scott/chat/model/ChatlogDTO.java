package com.scott.chat.model;

public class ChatlogDTO {
    private Integer chatlogid;
    private Integer senderid;
    private String inputtime;
    private String roommessage;
    public Integer getChatlogid() {
        return chatlogid;
    }

    public void setChatlogid(Integer chatlogid) {
        this.chatlogid = chatlogid;
    }

    public Integer getSenderid() {
        return senderid;
    }

    public void setSenderid(Integer senderid) {
        this.senderid = senderid;
    }

    public String getInputtime() {
        return inputtime;
    }

    public void setInputtime(String inputtime) {
        this.inputtime = inputtime;
    }

    public String getRoommessage() {
        return roommessage;
    }

    public void setRoommessage(String roommessage) {
        this.roommessage = roommessage;
    }

    public String getRoomfilebase64() {
        return roomfilebase64;
    }

    public void setRoomfilebase64(String roomfilebase64) {
        this.roomfilebase64 = roomfilebase64;
    }

    private String roomfilebase64;

    public ChatlogDTO(Chatlog chatlog) {
        this.chatlogid = chatlog.getChatlogid();
        this.senderid = chatlog.getMember().getMemberid();
        this.inputtime = chatlog.getInputtime();
        this.roommessage = chatlog.getRoommessage();
        if(chatlog.getRoomfile() != null) {
            this.roomfilebase64 = java.util.Base64.getEncoder().encodeToString(chatlog.getRoomfile());
        }
    }

    
}