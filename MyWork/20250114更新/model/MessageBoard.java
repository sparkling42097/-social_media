package tw.topic.memberdata.model;

import java.io.IOException;
import java.util.Base64;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;

@Entity
public class MessageBoard {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "Message_boardID")
	private Long messageboardid;
	
	@Column(name = "Message_Liked_count")
	private Integer messagelikedcount;

	//---------------------------------------------------------------------
	public Long getMessageboardid() {
		return messageboardid;
	}
	public void setMessageboardid(Long messageboardid) {
		this.messageboardid = messageboardid;
	}
	public Integer getMessagelikedcount() {
		return messagelikedcount;
	}
	public void setMessagelikedcount(Integer messagelikedcount) {
		this.messagelikedcount = messagelikedcount;
	}
	
	//---------------------------------------------------------------------
	@ManyToOne(optional = true ,cascade = CascadeType.REMOVE)
	@JoinColumn(name = "MessagelogID")
	private Messagelog messagelog;
	public Messagelog getMessagelog() {
		return messagelog;
	}
	public void setMessagelog(Messagelog messagelog) {
		this.messagelog = messagelog;
	}
	
	@OneToOne
	@JoinColumn(name = "PostID")
	private Post post;
	public Post getPost() {
	    return post;
	}
	public void setPost(Post post) {
	    this.post = post;
	}
	
}