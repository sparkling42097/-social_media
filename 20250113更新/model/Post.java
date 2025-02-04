package tw.topic.memberdata.model;

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
	private Long postid;

	private Long posterid;
	
	@Column(name = "Post_time")
	private String posttime;
	@Column(name = "Liked_count")
	private Integer likedcount;
	@Column(name = "Message_count")
	private Integer messagecount;
	@Column(name = "Post_content")
	private String postcontent;
	
	//---------------------------------------------------------------------
	public Long getPostid() {
		return postid;
	}
	public void setPostid(Long postid) {
		this.postid = postid;
	}
	public Long getPosterid() {
		return posterid;
	}
	public void setPosterid(Long posterid) {
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
	@ManyToOne
	@JoinColumn(name = "PosterID")
	private Member member;
	public Member getMember() {
		return member;
	}
	public void setMember(Member member) {
		this.member = member;
	}
	
	@OneToOne(mappedBy = "post" ,cascade = CascadeType.ALL ,fetch = FetchType.LAZY)
	private MessageBoard messageBoard;
	public MessageBoard getMessageBoard() {
	    return messageBoard;
	}
	public void setMessageBoard(MessageBoard messageBoard) {
	    this.messageBoard = messageBoard;
	}
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<PostPhoto> postphoto;
	public List<PostPhoto> getPostphoto() {
		return postphoto;
	}
	public void setPostphoto(List<PostPhoto> postphoto) {
		this.postphoto = postphoto;
	}
	
	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinTable(
	    name = "post_collect",
	    joinColumns = @JoinColumn(name = "post_id"),
	    inverseJoinColumns = @JoinColumn(name = "collect_id")
	)
	private Set<Collect> collect = new HashSet<>();
	public Set<Collect> getCollect() {
		return collect;
	}
	public void setCollect(Set<Collect> collect) {
		this.collect = collect;
	}

}