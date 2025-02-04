package tw.topic.memberdata.model;

import java.io.IOException;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

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
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints = {
	    @UniqueConstraint(columnNames = {"Member_a", "Member_b"})
	})
public class Chatroom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ChatroomID")
	private Long chatroomid;

	@Column(name = "Member_a")
	private Long membera;
	@Column(name = "Member_b")
	private Long memberb;
	
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
                Long temp = membera;
                membera = memberb;
                memberb = temp;
            }
        }
    }
	
	//---------------------------------------------------------------------
	public Long getChatroomid() {
		return chatroomid;
	}
	public void setChatroomid(Long chatroomid) {
		this.chatroomid = chatroomid;
	}
	public Long getMembera() {
		return membera;
	}
	public void setMembera(Long membera) {
		this.membera = membera;
	}
	public Long getMemberb() {
		return memberb;
	}
	public void setMemberb(Long memberb) {
		this.memberb = memberb;
	}
	
	//---------------------------------------------------------------------
	@OneToMany(mappedBy = "chatroom",cascade = CascadeType.REMOVE)
	private List<Chatlog> chatlog;
	public List<Chatlog> getChatlog() {
		return chatlog;
	}
	public void setChatlog(List<Chatlog> chatlog) {
		this.chatlog = chatlog;
	}
	
	@ManyToMany(mappedBy = "chatroom")
    private Set<Member> member = new HashSet<>();
	public Set<Member> getMember() {
		return member;
	}
	public void setMember(Set<Member> member) {
		this.member = member;
	}
	
}