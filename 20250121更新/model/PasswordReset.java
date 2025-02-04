package com.scott.chat.model;


import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "passwordreset")
public class PasswordReset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ResetID")
    private Integer resetid;

    @Column(nullable = false, unique = true)
    private String token;
    @Column(name = "Expiry_date", nullable = false)
    private Date expiryDate;
    @Column(name = "Created_at", nullable = false)
    private Date createdAt;

	//---------------------------------------------------------------------
	public Integer getResetid() {
		return resetid;
	}
	public void setResetid(Integer resetid) {
		this.resetid = resetid;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
        this.token = token;
    }
    public Date getExpiryDate() {
        return expiryDate;
    }
    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }
    public Date getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

	//---------------------------------------------------------------------
    // 判斷 Token 是否過期
    public boolean isExpired() {
        return expiryDate.before(new Date());
    }
    
    // 無參構造函數，JPA 需要這個
    public PasswordReset() {}

    // 帶參構造函數
    public PasswordReset(String token, Member member, Date expiryDate, Date createdAt) {
        this.token = token;
        this.member = member;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
    }
    
	//---------------------------------------------------------------------
    // 多對1，Member
    @ManyToOne
    @JoinColumn(
    		name = "MemberID", 
    		nullable = false)
    private Member member;
    public Member getMember() {
        return member;
    }
    public void setMember(Member member) {
        this.member = member;
    }
    
}
