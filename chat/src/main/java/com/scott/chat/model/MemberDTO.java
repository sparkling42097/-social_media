package com.scott.chat.model;

public class MemberDTO {
    private Integer memberid;
    private String email;
    private String membername;
    private String realname;
    private String memberphotobase64;
    private String gender;
    private String telephone;
    private String birthday;
    private String introduce;
    private Integer postcount;
    
    public MemberDTO(Member member) {
        this.memberid = member.getMemberid();
        this.email = member.getEmail();
        this.membername = member.getMembername();
        this.realname = member.getRealname();
        if(member.getMemberphoto() != null) {
            this.memberphotobase64 = java.util.Base64.getEncoder().encodeToString(member.getMemberphoto());
        }
        this.gender = member.getGender();
        this.telephone = member.getTelephone();
        this.birthday = member.getBirthday();
        this.introduce = member.getIntroduce();
        this.postcount = member.getPostcount();
    }

    public Integer getMemberid() {
        return memberid;
    }

    public void setMemberid(Integer memberid) {
        this.memberid = memberid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMembername() {
        return membername;
    }

    public void setMembername(String membername) {
        this.membername = membername;
    }

    public String getRealname() {
        return realname;
    }

    public void setRealname(String realname) {
        this.realname = realname;
    }

    public String getMemberphotobase64() {
        return memberphotobase64;
    }

    public void setMemberphotobase64(String memberphotobase64) {
        this.memberphotobase64 = memberphotobase64;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getIntroduce() {
        return introduce;
    }

    public void setIntroduce(String introduce) {
        this.introduce = introduce;
    }

    public Integer getPostcount() {
        return postcount;
    }

    public void setPostcount(Integer postcount) {
        this.postcount = postcount;
    }

    
}