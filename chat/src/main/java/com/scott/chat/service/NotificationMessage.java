package com.scott.chat.service;

public class NotificationMessage {
    private String type;
    private String message;
    private Integer senderId;
    
    public NotificationMessage(String type, String message, Integer senderId) {
        this.type = type;
        this.message = message;
        this.senderId = senderId;
    }
    
    // Getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Integer getSenderId() { return senderId; }
    public void setSenderId(Integer senderId) { this.senderId = senderId; }
}