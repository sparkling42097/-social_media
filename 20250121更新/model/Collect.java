package com.scott.chat.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;

@Entity
public class Collect {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CollectID")
	private Integer collectid;
	
	private Integer collecterid;
	private Integer postid;
	
	@Column(name = "Collected_count")
	private Integer collectedcount;

	//---------------------------------------------------------------------
	public Integer getCollectid() {
		return collectid;
	}
	public void setCollectid(Integer collectid) {
		this.collectid = collectid;
	}
	public Integer getPostid() {
		return postid;
	}
	public void setPostid(Integer postid) {
		this.postid = postid;
	}
	public Integer getCollectedcount() {
		return collectedcount;
	}
	public void setCollectedcount(Integer collectedcount) {
		this.collectedcount = collectedcount;
	}
	public Integer getCollecterid() {
		return collecterid;
	}
	public void setCollecterid(Integer collecterid) {
		this.collecterid = collecterid;
	}
	
	//---------------------------------------------------------------------
//	// 多對多，Member
//	@ManyToMany(mappedBy = "collect")
//    private Set<Member> member = new HashSet<>();
//	public Set<Member> getMember() {
//		return member;
//	}
//	public void setMember(Set<Member> member) {
//		this.member = member;
//	}
//	
//	// 多對多，Post
//	@ManyToMany(mappedBy = "collect" ,cascade = CascadeType.ALL)
//	private Set<Post> post = new HashSet<>();
//	public Set<Post> getPost() {
//		return post;
//	}
//	public void setPost(Set<Post> post) {
//		this.post = post;
//	}
//	
}