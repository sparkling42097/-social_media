package tw.topic.memberdata.model;

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
	private Long collectid;
	
	private Long postid;
	private Long collecterid;
	
	@Column(name = "Collected_count")
	private Integer collectedcount;

	//---------------------------------------------------------------------
	public Long getCollectid() {
		return collectid;
	}
	public void setCollectid(Long collectid) {
		this.collectid = collectid;
	}
	public Long getPostid() {
		return postid;
	}
	public void setPostid(Long postid) {
		this.postid = postid;
	}
	public Long getCollecterid() {
		return collecterid;
	}
	public void setCollecterid(Long collecterid) {
		this.collecterid = collecterid;
	}
	public Integer getCollectedcount() {
		return collectedcount;
	}
	public void setCollectedcount(Integer collectedcount) {
		this.collectedcount = collectedcount;
	}
	
	//---------------------------------------------------------------------
	@ManyToMany(mappedBy = "collect")
    private Set<Member> member = new HashSet<>();
	public Set<Member> getMember() {
		return member;
	}
	public void setMember(Set<Member> member) {
		this.member = member;
	}
	
	@ManyToMany(mappedBy = "collect" ,cascade = CascadeType.ALL)
	private Set<Post> post = new HashSet<>();
	public Set<Post> getPost() {
		return post;
	}
	public void setPost(Set<Post> post) {
		this.post = post;
	}
	
}