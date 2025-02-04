CREATE DATABASE IF NOT EXISTS `social` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `social`;

-- --------------------------------------------------------

--
-- 資料表結構 `chatlog`
--

DROP TABLE IF EXISTS `chatlog`;
CREATE TABLE `chatlog` (
  `ChatlogID` int(30) UNSIGNED NOT NULL,
  `ChatroomID` int(30) UNSIGNED NOT NULL,
  `SenderID` int(30) UNSIGNED NOT NULL COMMENT '發送訊息的人',
  `Input_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Room_message` varchar(1000) DEFAULT NULL,
  `Room_file` mediumblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `chatroom`
--

DROP TABLE IF EXISTS `chatroom`;
CREATE TABLE `chatroom` (
  `ChatroomID` int(30) UNSIGNED NOT NULL,
  `Member_a` int(30) UNSIGNED NOT NULL,
  `Member_b` int(30) UNSIGNED NOT NULL,
  `Status` varchar(10) DEFAULT 'ask' COMMENT '好友狀態，ask/confirm'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `collect`
--

DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect` (
  `CollectID` int(30) UNSIGNED NOT NULL,
  `CollecterID` int(30) UNSIGNED NOT NULL COMMENT '收藏者',
  `PostID` int(30) UNSIGNED NOT NULL,
  `Collected_count` int(30) UNSIGNED NOT NULL DEFAULT 0 COMMENT '被收藏數，預設為0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int(11) NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int(11) DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `execution_time` int(11) NOT NULL,
  `success` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `member`
--

DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `MemberID` int(30) UNSIGNED NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Realname` varchar(30) NOT NULL COMMENT '真實姓名',
  `Member_name` varchar(30) NOT NULL COMMENT '暱稱',
  `Member_photo` mediumblob DEFAULT NULL COMMENT '大頭貼',
  `Gender` char(1) DEFAULT NULL COMMENT '性別(男、女)',
  `Telephone` varchar(30) DEFAULT NULL COMMENT '手機',
  `Birthday` date DEFAULT NULL COMMENT 'yyyy-mm-dd',
  `Introduce` varchar(1000) DEFAULT NULL COMMENT '自我介紹',
  `Post_count` int(30) DEFAULT 0 COMMENT '發過的貼文數，預設為0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `messageboard`
--

DROP TABLE IF EXISTS `messageboard`;
CREATE TABLE `messageboard` (
  `Message_boardID` int(30) UNSIGNED NOT NULL,
  `PostID` int(30) UNSIGNED NOT NULL,
  `MessagelogID` int(30) UNSIGNED DEFAULT NULL,
  `Message_Liked_count` int(30) UNSIGNED DEFAULT 0 COMMENT '留言點讚數，預設值為0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `messagelog`
--

DROP TABLE IF EXISTS `messagelog`;
CREATE TABLE `messagelog` (
  `MessagelogID` int(30) UNSIGNED NOT NULL,
  `Message_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Message` varchar(1000) DEFAULT NULL,
  `Message_file` mediumblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `passwordreset`
--

DROP TABLE IF EXISTS `passwordreset`;
CREATE TABLE `passwordreset` (
  `ResetID` int(30) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `MemberID` int(30) UNSIGNED NOT NULL,
  `Expiry_date` datetime NOT NULL COMMENT '有效時間',
  `Created_at` datetime NOT NULL COMMENT '產出時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `PostID` int(30) UNSIGNED NOT NULL,
  `PosterID` int(30) UNSIGNED NOT NULL COMMENT '發貼文的人',
  `Post_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Liked_count` int(30) UNSIGNED DEFAULT 0 COMMENT '按讚數，預設值為0',
  `Message_count` int(30) UNSIGNED DEFAULT 0 COMMENT '留言數，預設值為0',
  `Post_content` varchar(1000) DEFAULT NULL COMMENT '貼文內文'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `postphoto`
--

DROP TABLE IF EXISTS `postphoto`;
CREATE TABLE `postphoto` (
  `Post_photoID` int(30) UNSIGNED NOT NULL,
  `PostID` int(30) UNSIGNED NOT NULL,
  `Posted_photo` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `sticker`
--

DROP TABLE IF EXISTS `sticker`;
CREATE TABLE `sticker` (
  `StickerID` int(30) UNSIGNED NOT NULL,
  `Sticker_type` varchar(30) DEFAULT NULL COMMENT '關鍵字，ex: 早安、加油、你好、吃飯...',
  `Sticker` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `chatlog`
--
ALTER TABLE `chatlog`
  ADD PRIMARY KEY (`ChatlogID`),
  ADD KEY `ChatroomID` (`ChatroomID`),
  ADD KEY `SenderID` (`SenderID`);

--
-- 資料表索引 `chatroom`
--
ALTER TABLE `chatroom`
  ADD PRIMARY KEY (`ChatroomID`),
  ADD KEY `Member_a` (`Member_a`),
  ADD KEY `Member_b` (`Member_b`);

--
-- 資料表索引 `collect`
--
ALTER TABLE `collect`
  ADD PRIMARY KEY (`CollectID`),
  ADD KEY `PostID` (`PostID`),
  ADD KEY `CollecterID` (`CollecterID`);

--
-- 資料表索引 `flyway_schema_history`
--
ALTER TABLE `flyway_schema_history`
  ADD PRIMARY KEY (`installed_rank`),
  ADD KEY `flyway_schema_history_s_idx` (`success`);

--
-- 資料表索引 `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`MemberID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- 資料表索引 `messageboard`
--
ALTER TABLE `messageboard`
  ADD PRIMARY KEY (`Message_boardID`),
  ADD KEY `BoardID` (`PostID`),
  ADD KEY `MessagelogID` (`MessagelogID`);

--
-- 資料表索引 `messagelog`
--
ALTER TABLE `messagelog`
  ADD PRIMARY KEY (`MessagelogID`);

--
-- 資料表索引 `passwordreset`
--
ALTER TABLE `passwordreset`
  ADD PRIMARY KEY (`ResetID`),
  ADD UNIQUE KEY `token` (`Token`),
  ADD KEY `member_id` (`MemberID`);

--
-- 資料表索引 `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`PostID`),
  ADD KEY `PosterID` (`PosterID`);

--
-- 資料表索引 `postphoto`
--
ALTER TABLE `postphoto`
  ADD PRIMARY KEY (`Post_photoID`),
  ADD KEY `PostID` (`PostID`);

--
-- 資料表索引 `sticker`
--
ALTER TABLE `sticker`
  ADD PRIMARY KEY (`StickerID`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `chatlog`
--
ALTER TABLE `chatlog`
  MODIFY `ChatlogID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `chatroom`
--
ALTER TABLE `chatroom`
  MODIFY `ChatroomID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `collect`
--
ALTER TABLE `collect`
  MODIFY `CollectID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `member`
--
ALTER TABLE `member`
  MODIFY `MemberID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `messageboard`
--
ALTER TABLE `messageboard`
  MODIFY `Message_boardID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `messagelog`
--
ALTER TABLE `messagelog`
  MODIFY `MessagelogID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `passwordreset`
--
ALTER TABLE `passwordreset`
  MODIFY `ResetID` int(30) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `post`
--
ALTER TABLE `post`
  MODIFY `PostID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `postphoto`
--
ALTER TABLE `postphoto`
  MODIFY `Post_photoID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `sticker`
--
ALTER TABLE `sticker`
  MODIFY `StickerID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `chatlog`
--
ALTER TABLE `chatlog`
  ADD CONSTRAINT `chatlog_ibfk_1` FOREIGN KEY (`SenderID`) REFERENCES `member` (`MemberID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chatlog_ibfk_3` FOREIGN KEY (`ChatroomID`) REFERENCES `chatroom` (`ChatroomID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `chatroom`
--
ALTER TABLE `chatroom`
  ADD CONSTRAINT `chatroom_ibfk_1` FOREIGN KEY (`Member_a`) REFERENCES `member` (`MemberID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chatroom_ibfk_2` FOREIGN KEY (`Member_b`) REFERENCES `member` (`MemberID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `collect`
--
ALTER TABLE `collect`
  ADD CONSTRAINT `collect_ibfk_2` FOREIGN KEY (`PostID`) REFERENCES `post` (`PostID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `collect_ibfk_3` FOREIGN KEY (`CollecterID`) REFERENCES `member` (`MemberID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `messageboard`
--
ALTER TABLE `messageboard`
  ADD CONSTRAINT `messageboard_ibfk_1` FOREIGN KEY (`PostID`) REFERENCES `post` (`PostID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messageboard_ibfk_4` FOREIGN KEY (`MessagelogID`) REFERENCES `messagelog` (`MessagelogID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `passwordreset`
--
ALTER TABLE `passwordreset`
  ADD CONSTRAINT `passwordreset_ibfk_1` FOREIGN KEY (`MemberID`) REFERENCES `member` (`MemberID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`PosterID`) REFERENCES `member` (`MemberID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `postphoto`
--
ALTER TABLE `postphoto`
  ADD CONSTRAINT `postphoto_ibfk_1` FOREIGN KEY (`PostID`) REFERENCES `post` (`PostID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;