package tw.topic.memberdata.model;

import java.io.IOException;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Transient;

@Entity
public class Sticker {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "StickerID")
	private Long stickerid;
	
	@Column(name = "Sticker_type")
	private String stickertype;
	
	// 貼圖傳輸三階段變數
	private byte[] sticker;
	@Transient
	private MultipartFile stickerfile;
	@Transient
	private String stickerbase64;
	
	//---------------------------------------------------------------------------
	public Long getStickerid() {
		return stickerid;
	}
	public void setStickerid(Long stickerid) {
		this.stickerid = stickerid;
	}
	public String getStickertype() {
		return stickertype;
	}
	public void setStickertype(String stickertype) {
		this.stickertype = stickertype;
	}
	
	//---------------------------------------------------------------------------
	public byte[] getSticker() {
		return sticker;
	}
	public void setSticker(byte[] sticker) {
		System.out.println("取回貼圖");
		this.sticker = sticker;
		stickerbase64 = Base64.getEncoder().encodeToString(sticker);
		System.out.println(stickerbase64);
	}
	public MultipartFile getStickerfile() {
		return stickerfile;
	}
	public void setStickerfile(MultipartFile stickerfile) {
		System.out.println("上傳貼圖");
		this.stickerfile = stickerfile;
		try {
			sticker = stickerfile.getBytes();
		} catch (IOException e) {
		}
	}
	public String getStickerbase64() {
		return stickerbase64;
	}
	public void setStickerbase64(String stickerbase64) {
		this.stickerbase64 = stickerbase64;
	}
	
	//---------------------------------------------------------------------------
	@ManyToMany(mappedBy = "sticker")
    private Set<Messagelog> messagelog = new HashSet<>();
	public Set<Messagelog> getMessagelog() {
		return messagelog;
	}
	public void setMessagelog(Set<Messagelog> messagelog) {
		this.messagelog = messagelog;
	}

	@ManyToMany(mappedBy = "sticker")
    private Set<Messagelog> chatlog = new HashSet<>();
	public Set<Messagelog> getChatlog() {
		return chatlog;
	}
	public void setChatlog(Set<Messagelog> chatlog) {
		this.chatlog = chatlog;
	}
	
}