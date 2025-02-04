package com.scott.chat.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

@Entity
public class Chatlog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ChatlogID")
	private Integer chatlogid;
	
	//以下兩個變數因為沒有關聯而重新建立
//	private Integer chatroomid;
	private Integer senderid;
	
	@Column(name = "Input_time" ,columnDefinition = "TIMESTAMP")
	private String inputtime;
	@Column(name = "Room_message" ,columnDefinition = "VARCHAR(1000)")
	private String roommessage;
	
	// file傳輸三階段變數
	@Column(name = "Room_file" ,columnDefinition = "MEDIUMBLOB")
	private byte[] roomfile;
	@Transient
	private MultipartFile roomfilefile;
	@Transient
	private String roomfilebase64;
	
	//---------------------------------------------------------------------
	public Integer getChatlogid() {
		return chatlogid;
	}
	public void setChatlogid(Integer chatlogid) {
		this.chatlogid = chatlogid;
	}
//	public Integer getChatroomid() {
//		return chatroomid;
//	}
//	public void setChatroomid(Integer chatroomid) {
//		this.chatroomid = chatroomid;
//	}
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
	
	//---------------------------------------------------------------------
	public byte[] getRoomfile() {
		return roomfile;
	}
	public void setRoomfile(byte[] roomfile) {
		System.out.println("上傳聊天室檔案");
		this.roomfile = roomfile;
		try {
			roomfile = roomfilefile.getBytes();
		} catch (IOException e) {
		}
	}
	public MultipartFile getRoomfilefile() {
		return roomfilefile;
	}
	public void setRoomfilefile(MultipartFile roomfilefile) {
		this.roomfilefile = roomfilefile;
	}
	public String getRoomfilebase64() {
		return roomfilebase64;
	}
	public void setRoomfilebase64(String roomfilebase64) {
		this.roomfilebase64 = roomfilebase64;
	}
	
	//---------------------------------------------------------------------
//	// 多對1，Member
//	@ManyToOne
//	@JoinColumn(
//			name = "senderid",
//			columnDefinition = "INT(30) UNSIGNED")
//	private Member member;
//	public Member getMember() {
//		return member;
//	}
//	public void setMember(Member member) {
//		this.member = member;
//	}
//	
	// 多對1，Chatroom
	@ManyToOne
	@JoinColumn(
			name = "chatroomid",
			columnDefinition = "INT(30) UNSIGNED")
	private Chatroom chatroom;
	public Chatroom getChatroom() {
		return chatroom;
	}
	public void setChatroom(Chatroom chatroom) {
		this.chatroom = chatroom;
	}
//	
//	// 多對多，Sticker
//	@ManyToMany
//	@JoinTable(
//		    name = "chatlog_sticker",
//		    joinColumns = @JoinColumn(
//		    		name = "ChatlogID",
//		    		columnDefinition = "INT(30) UNSIGNED"),
//		    inverseJoinColumns = @JoinColumn(
//		    		name = "StickerID",
//		    		columnDefinition = "INT(30) UNSIGNED")
//			)
//    private List<Sticker> sticker = new ArrayList<>();
//	public List<Sticker> getSticker() {
//		return sticker;
//	}
//	public void setSticker(List<Sticker> sticker) {
//		this.sticker = sticker;
//	}

}