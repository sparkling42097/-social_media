package com.scott.chat.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints = {
	    @UniqueConstraint(columnNames = {"Member_a", "Member_b"})
	})
public class Chatroom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ChatroomID")
	private Integer chatroomid;

	@Column(name = "Member_a")
	private Integer membera;
	@Column(name = "Member_b")
	private Integer memberb;
	
	private String status;
	
	// 建立membera、memberb的大小先後順序
	@PrePersist	 // 在實體被首次保存到資料庫之前自動執行
    @PreUpdate // 在實體被更新到資料庫之前自動執行
    private void validateMembers() {
        if (membera != null && memberb != null) {
            if (membera.equals(memberb)) {
                throw new IllegalStateException("Member A and Member B cannot be the same");
            }
            // 確保較小的 ID 始終是 membera
            if (membera > memberb) {
                Integer temp = membera;
                membera = memberb;
                memberb = temp;
            }
        }
    }
	
	//---------------------------------------------------------------------
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
	
	//---------------------------------------------------------------------
//	// 1對多，Chatlog
//	@OneToMany(mappedBy = "chatroom",cascade = CascadeType.REMOVE)
//	private List<Chatlog> chatlog;
//	public List<Chatlog> getChatlog() {
//		return chatlog;
//	}
//	public void setChatlog(List<Chatlog> chatlog) {
//		this.chatlog = chatlog;
//	}
//	
//	// 多對多，Member
//	@ManyToMany(mappedBy = "chatroom")
//    private Set<Member> member = new HashSet<>();
//	public Set<Member> getMember() {
//		return member;
//	}
//	public void setMember(Set<Member> member) {
//		this.member = member;
//	}
//	
}