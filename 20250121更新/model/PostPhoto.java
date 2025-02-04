package com.scott.chat.model;

import java.util.Base64;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "postphoto")
public class PostPhoto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "Post_photoID")
	private Integer postphotoid;
	
	//以下變數因為沒有關聯而重新建立
	private Integer postid;
	
	// 各個貼文圖片的傳輸三階段
	@Column(name = "Posted_photo" ,columnDefinition = "MEDIUMBLOB")
	private byte[] postedphoto;
	@Transient
	private MultipartFile postedphotofile;
	@Transient
	private String postedphotobase64;
	
	//---------------------------------------------------------------------------
	public Integer getPostphotoid() {
		return postphotoid;
	}
	public void setPostphotoid(Integer postphotoid) {
		this.postphotoid = postphotoid;
	}
	public Integer getPostid() {
		return postid;
	}
	public void setPostid(Integer postid) {
		this.postid = postid;
	}
	
	//---------------------------------------------------------------------------
	public byte[] getPostedphoto() {
		return postedphoto;
	}
	public void setPostedphoto(byte[] postedphoto) {
		System.out.println("取回圖片");
		this.postedphoto = postedphoto;
		postedphotobase64 = Base64.getEncoder().encodeToString(postedphoto);
		System.out.println(postedphotobase64);
	}
	public MultipartFile getPostedphotofile() {
		return postedphotofile;
	}
	public void setPostedphotofile(MultipartFile postedphotofile) {
		System.out.println("上傳圖片...");
		this.postedphotofile = postedphotofile;
		try {
			postedphoto = postedphotofile.getBytes();
		} catch (Exception e) {
		}
	}
	public String getPostedphotobase64() {
		return postedphotobase64;
	}
	public void setPostedphotobase64(String postedphotobase64) {
		this.postedphotobase64 = postedphotobase64;
	}
	
	//---------------------------------------------------------------------------
//	// 多對1，Post
//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(
//			name = "postid",
//			columnDefinition = "INT(30) UNSIGNED")
//	private Post post;
//	public Post getPost() {
//		return post;
//	}
//	public void setPost(Post post) {
//		this.post = post;
//	}
	
}