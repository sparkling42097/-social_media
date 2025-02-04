package tw.topic.memberdata.model;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;

@Entity
public class Chatlog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ChatlogID")
	private Long chatlogid;
	
	@Column(name = "Input_time")
	private String inputtime;
	@Column(name = "Room_message")
	private String roommessage;
	
	private Long stickerid;
	
	// file傳輸三階段變數
	@Column(name = "Room_file" ,columnDefinition = "MEDIUMBLOB")
	private byte[] roomfile;	// 以下兩個階段變數過長，roomfile縮寫成rf
	@Transient
	private MultipartFile roomfilefile;
	@Transient
	private String roomfilebase64;
	
	//---------------------------------------------------------------------
	public Long getChatlogid() {
		return chatlogid;
	}
	public void setChatlogid(Long chatlogid) {
		this.chatlogid = chatlogid;
	}
	public String getInputtime() {
		return inputtime;
	}
	public void setInputtime(String inputtime) {
		this.inputtime = inputtime;
	}
	public String getRoommessage() {
		return roommessage;
	}
	public void setRoommessage(String roommessage) {
		this.roommessage = roommessage;
	}
	public Long getStickerid() {
		return stickerid;
	}
	public void setStickerid(Long stickerid) {
		this.stickerid = stickerid;
	}
	
	//---------------------------------------------------------------------
	public byte[] getRoomfile() {
		return roomfile;
	}
	public void setRoomfile(byte[] roomfile) {
		System.out.println("上傳聊天室檔案");
		this.roomfile = roomfile;
		try {
			roomfile = roomfilefile.getBytes();
		} catch (IOException e) {
		}
	}
	public MultipartFile getRoomfilefile() {
		return roomfilefile;
	}
	public void setRoomfilefile(MultipartFile roomfilefile) {
		this.roomfilefile = roomfilefile;
	}
	public String getRoomfilebase64() {
		return roomfilebase64;
	}
	public void setRoomfilebase64(String roomfilebase64) {
		this.roomfilebase64 = roomfilebase64;
	}
	
	//---------------------------------------------------------------------
	@ManyToOne
	@JoinColumn(name = "SenderID")
	private Member member;
	public Member getMember() {
		return member;
	}
	public void setMember(Member member) {
		this.member = member;
	}
	
	@ManyToOne
	@JoinColumn(name = "ChatroomID")
	private Chatroom chatroom;
	public Chatroom getChatroom() {
		return chatroom;
	}
	public void setChatroom(Chatroom chatroom) {
		this.chatroom = chatroom;
	}
	
	@ManyToMany
    @JoinTable(
        name = "chatlog_sticker",
        joinColumns = @JoinColumn(name = "chatlog_id"),
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