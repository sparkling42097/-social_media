package tw.topic.memberdata.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import jakarta.persistence.JoinColumn;

@Entity
public class Messagelog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "MessagelogID")
	private Long messageid;
	
	@Column(name = "Message_time")
	private String messagetime;
	
	private String message;
	
	// file傳輸三階段變數
	@Column(name = "Message_file" ,columnDefinition = "MEDIUMBLOB")
	private byte[] messagefile;	// 以下兩個變數縮寫成mf開頭
	@Transient
	private MultipartFile messagefilefile;
	@Transient
	private String messagefilebase64;
	
	//---------------------------------------------------------------------
	public Long getMessageid() {
		return messageid;
	}
	public void setMessageid(Long messageid) {
		this.messageid = messageid;
	}
	public String getMessagetime() {
		return messagetime;
	}
	public void setMessagetime(String messagetime) {
		this.messagetime = messagetime;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	//---------------------------------------------------------------------
	public byte[] getMessagefile() {
		return messagefile;
	}
	public void setMessagefile(byte[] messagefile) {
		System.out.println("取回留言板檔案");
		this.messagefile = messagefile;
		messagefilebase64 = Base64.getEncoder().encodeToString(messagefile);
		System.out.println(messagefilebase64);
	}
	public MultipartFile getMessagefilefile() {
		return messagefilefile;
	}
	public void setMessagefilefile(MultipartFile messagefilefile) {
		System.out.println("上傳留言板檔案");
		this.messagefilefile = messagefilefile;
		try {
			messagefile = messagefilefile.getBytes();
		} catch (IOException e) {
		}
	}
	public String getMessagefilebase64() {
		return messagefilebase64;
	}
	public void setMessagefilebase64(String messagefilebase64) {
		this.messagefilebase64 = messagefilebase64;
	}
	
	//---------------------------------------------------------------------
	@OneToMany(mappedBy = "messagelog")
	private List<MessageBoard> messageBoard;
	public List<MessageBoard> getMessageBoard() {
		return messageBoard;
	}
	public void setMessageBoard(List<MessageBoard> messageBoard) {
		this.messageBoard = messageBoard;
	}
	
	//---------------------------------------------------------------------
	@ManyToMany
    @JoinTable(
        name = "message_sticker",
        joinColumns = @JoinColumn(name = "message_id"),
        inverseJoinColumns = @JoinColumn(name = "sticker_id")
    )
    private List<Sticker> sticker = new ArrayList<>();
	public List<Sticker> getSticker() {
		return sticker;
	}
	public void setSticker(List<Sticker> sticker) {
		this.sticker = sticker;
	}
	
}