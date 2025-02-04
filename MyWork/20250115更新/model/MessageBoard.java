package tw.topic.memberdata.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class MessageBoard {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "Message_boardID")
	private Integer messageboardid;
	
	@Column(name = "Message_Liked_count")
	private Integer messagelikedcount;

	//---------------------------------------------------------------------
	public Integer getMessageboardid() {
		return messageboardid;
	}
	public void setMessageboardid(Integer messageboardid) {
		this.messageboardid = messageboardid;
	}
	public Integer getMessagelikedcount() {
		return messagelikedcount;
	}
	public void setMessagelikedcount(Integer messagelikedcount) {
		this.messagelikedcount = messagelikedcount;
	}
	
	//---------------------------------------------------------------------
	// 1對1，Post
	@OneToOne
	@JoinColumn(
			name = "postid",
			columnDefinition = "INT(30) UNSIGNED")
	private Post post;
	public Post getPost() {
	    return post;
	}
	public void setPost(Post post) {
	    this.post = post;
	}
	
	// 多對1，Messagelog
	@ManyToOne(optional = true ,cascade = CascadeType.REMOVE)
	@JoinColumn(
			name = "messagelogid",
			columnDefinition = "INT(30) UNSIGNED")
	private Messagelog messagelog;
	public Messagelog getMessagelog() {
		return messagelog;
	}
	public void setMessagelog(Messagelog messagelog) {
		this.messagelog = messagelog;
	}
	
}