package com.scott.chat.model;

import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import jakarta.persistence.JoinColumn;

@Entity
public class Member {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "MemberID")
	private Integer memberid;
	
	@Column(unique = true ,columnDefinition = "VARCHAR(30)")
	private String email;
	@Column(columnDefinition = "VARCHAR(100)")
	private String password;
	@Column(columnDefinition = "VARCHAR(30)")
	private String realname;
	@Column(name = "Member_name",columnDefinition = "VARCHAR(30)")
	private String membername;
	
	// 大頭貼傳輸三階段變數
	@Column(name = "Member_photo" ,columnDefinition = "MEDIUMBLOB")
	private byte[] memberphoto;
	@Transient
	private MultipartFile memberphotofile;
	@Transient
	private String memberphotobase64;
	
	@Column(columnDefinition = "CHAR(1)")
	private String gender;
	@Column(columnDefinition = "VARCHAR(30)")
	private String telephone;
	@Column(columnDefinition = "DATE")
	private String birthday;
	@Column(columnDefinition = "VARCHAR(1000)")
	private String introduce;
	@Column(name = "Post_count")
	private Integer postcount;
	
	//---------------------------------------------------------------------
	public Integer getMemberid() {
		return memberid;
	}
	public void setMemberid(Integer memberid) {
		this.memberid = memberid;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getRealname() {
		return realname;
	}
	public void setRealname(String realname) {
		this.realname = realname;
	}
	public String getMembername() {
		return membername;
	}
	public void setMembername(String membername) {
		this.membername = membername;
	}
	
	//---------------------------------------------------------------------
	public byte[] getMemberphoto() {
		return memberphoto;
	}
	public void setMemberphoto(byte[] memberphoto) {
		System.out.println("取回大頭貼");
		this.memberphoto = memberphoto;
		memberphotobase64 = Base64.getEncoder().encodeToString(memberphoto);
		//System.out.println(memberphotobase64);
	}
	public MultipartFile getMemberphotofile() {
		return memberphotofile;
	}
	public void setMemberphotofile(MultipartFile memberphotofile) {
		System.out.println("上傳大頭貼...");
		this.memberphotofile = memberphotofile;
		try {
			memberphoto = memberphotofile.getBytes();
		} catch (Exception e) {
		}
	}
	public String getMemberphotobase64() {
		return memberphotobase64;
	}
	public void setMemberphotobase64(String memberphotobase64) {
		this.memberphotobase64 = memberphotobase64;
	}
	
	//---------------------------------------------------------------------
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getIntroduce() {
		return introduce;
	}
	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}
	public Integer getPostcount() {
		return postcount;
	}
	public void setPostcount(Integer postcount) {
		this.postcount = postcount;
	}
	
	//---------------------------------------------------------------------
//	// 1對多，Post
//	@OneToMany(mappedBy = "member" ,cascade = CascadeType.ALL)
//	private List<Post> post;
//	public List<Post> getPost() {
//		return post;
//	}
//	public void setPost(List<Post> post) {
//		this.post = post;
//	}
//	
	// 1對多，Chatlog
	@OneToMany(mappedBy = "member" ,cascade = CascadeType.ALL ,fetch = FetchType.LAZY)
	private List<Chatlog> chatlog;
	public List<Chatlog> getChatlog() {
		return chatlog;
	}
	public void setChatlog(List<Chatlog> chatlog) {
		this.chatlog = chatlog;
	}
//	
//	// 多對多，Collect
//	@ManyToMany(cascade = CascadeType.ALL)
//	@JoinTable(
//		    name = "member_collect",
//		    joinColumns = @JoinColumn(
//		    		name = "MemberID",
//		    		columnDefinition = "INT(30) UNSIGNED"),
//		    inverseJoinColumns = @JoinColumn(
//		    		name = "CollectID",
//		    		columnDefinition = "INT(30) UNSIGNED")
//			)
//    private Set<Collect> collect = new HashSet<>();
//	public Set<Collect> getCollect() {
//		return collect;
//	}
//	public void setCollect(Set<Collect> collect) {
//		this.collect = collect;
//	}
//
	// 多對多，Chatroom
	@ManyToMany(cascade = CascadeType.ALL ,fetch = FetchType.LAZY)
	@JoinTable(
		    name = "member_chatroom",
		    joinColumns = @JoinColumn(
		    		name = "MemberID",
		    		columnDefinition = "INT(30) UNSIGNED"),
		    inverseJoinColumns = @JoinColumn(
		    		name = "ChatroomID",
		    		columnDefinition = "INT(30) UNSIGNED")
			)
    private Set<Chatroom> chatroom = new HashSet<>();
	public Set<Chatroom> getChatroom() {
		return chatroom;
	}
	public void setChatroom(Set<Chatroom> chatroom) {
		this.chatroom = chatroom;
	}

}