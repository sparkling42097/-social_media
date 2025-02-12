-- V2__Create_Junction_Tables.sql

-- Member-Collect junction table
CREATE TABLE member_collect (
    MemberID INT(30) UNSIGNED NOT NULL,
    CollectID INT(30) UNSIGNED NOT NULL,
    PRIMARY KEY (MemberID, CollectID),
    FOREIGN KEY (MemberID) REFERENCES member(MemberID) ON DELETE CASCADE,
    FOREIGN KEY (CollectID) REFERENCES collect(CollectID) ON DELETE CASCADE
);

-- Member-Chatroom junction table
CREATE TABLE member_chatroom (
    MemberID INT(30) UNSIGNED NOT NULL,
    ChatroomID INT(30) UNSIGNED NOT NULL,
    PRIMARY KEY (MemberID, ChatroomID),
    FOREIGN KEY (MemberID) REFERENCES member(MemberID) ON DELETE CASCADE,
    FOREIGN KEY (ChatroomID) REFERENCES chatroom(ChatroomID) ON DELETE CASCADE
);

-- Message-Sticker junction table
CREATE TABLE messagelog_sticker (
    MessageID INT(30) UNSIGNED NOT NULL,
    StickerID INT(30) UNSIGNED NOT NULL,
    PRIMARY KEY (MessageID, StickerID),
    FOREIGN KEY (MessageID) REFERENCES messagelog(MessagelogID) ON DELETE CASCADE,
    FOREIGN KEY (StickerID) REFERENCES sticker(StickerID) ON DELETE CASCADE
);

-- Chatlog-Sticker junction table
CREATE TABLE chatlog_sticker (
    ChatlogID INT(30) UNSIGNED NOT NULL,
    StickerID INT(30) UNSIGNED NOT NULL,
    PRIMARY KEY (ChatlogID, StickerID),
    FOREIGN KEY (ChatlogID) REFERENCES chatlog(ChatlogID) ON DELETE CASCADE,
    FOREIGN KEY (StickerID) REFERENCES sticker(StickerID) ON DELETE CASCADE
);

-- Post-Collect junction table
CREATE TABLE post_collect (
    PostID INT(30) UNSIGNED NOT NULL,
    CollectID INT(30) UNSIGNED NOT NULL,
    PRIMARY KEY (PostID, CollectID),
    FOREIGN KEY (PostID) REFERENCES post(PostID) ON DELETE CASCADE,
    FOREIGN KEY (CollectID) REFERENCES collect(CollectID) ON DELETE CASCADE
);