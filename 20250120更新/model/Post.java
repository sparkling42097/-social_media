package com.scott.chat.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Post {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "PostID")
	private Integer postid;
	
	//以下變數因為沒有關聯而重新建立
	private Integer posterid;

	@Column(name = "Post_time", columnDefinition = "TIMESTAMP")
	private String posttime;
	@Column(name = "Liked_count")
	private Integer likedcount;
	@Column(name = "Message_count")
	private Integer messagecount;
	@Column(name = "Post_content", columnDefinition = "VARCHAR(1000)")
	private String postcontent;
	
	//---------------------------------------------------------------------
	public Integer getPostid() {
		return postid;
	}
	public void setPostid(Integer postid) {
		this.postid = postid;
	}
	public Integer getPosterid() {
		return posterid;
	}
	public void setPosterid(Integer posterid) {
		this.posterid = posterid;
	}
	public String getPosttime() {
		return posttime;
	}
	public void setPosttime(String posttime) {
		this.posttime = posttime;
	}
	public Integer getLikedcount() {
		return likedcount;
	}
	public void setLikedcount(Integer likedcount) {
		this.likedcount = likedcount;
	}
	public Integer getMessagecount() {
		return messagecount;
	}
	public void setMessagecount(Integer messagecount) {
		this.messagecount = messagecount;
	}
	public String getPostcontent() {
		return postcontent;
	}
	public void setPostcontent(String postcontent) {
		this.postcontent = postcontent;
	}
	
	//---------------------------------------------------------------------
//	// 1對1，MessageBoard
//	@OneToOne(mappedBy = "post" ,cascade = CascadeType.ALL ,fetch = FetchType.LAZY)
//	private MessageBoard messageBoard;
//	public MessageBoard getMessageBoard() {
//		return messageBoard;
//	}
//	public void setMessageBoard(MessageBoard messageBoard) {
//		this.messageBoard = messageBoard;
//	}
//	
//	// 多對1，Member
//	@ManyToOne
//	@JoinColumn(
//			name = "posterid",
//			columnDefinition = "INT(30) UNSIGNED")
//	private Member member;
//	public Member getMember() {
//		return member;
//	}
//	public void setMember(Member member) {
//		this.member = member;
//	}
//	
//	// 1對多，PostPhoto
//	@OneToMany(cascade = CascadeType.ALL)
//	@JoinColumn(
//			name = "postid",
//			columnDefinition = "INT(30) UNSIGNED")
//	private List<PostPhoto> postphoto;
//	public List<PostPhoto> getPostphoto() {
//		return postphoto;
//	}
//	public void setPostphoto(List<PostPhoto> postphoto) {
//		this.postphoto = postphoto;
//	}
//	
//	// 多對多，Collect
//	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//	@JoinTable(
//		    name = "post_collect",
//		    joinColumns = @JoinColumn(
//		    		name = "PostID",
//		    		columnDefinition = "INT(30) UNSIGNED"),
//		    inverseJoinColumns = @JoinColumn(
//		    		name = "CollectID",
//		    		columnDefinition = "INT(30) UNSIGNED")
//		)
//	private Set<Collect> collect = new HashSet<>();
//	public Set<Collect> getCollect() {
//		return collect;
//	}
//	public void setCollect(Set<Collect> collect) {
//		this.collect = collect;
//	}

}