-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-01-13 09:20:52
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `social`
--

-- --------------------------------------------------------

--
-- 資料表結構 `chatlog`
--

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

CREATE TABLE `chatroom` (
  `ChatroomID` int(30) UNSIGNED NOT NULL,
  `Member_a` int(30) UNSIGNED NOT NULL,
  `Member_b` int(30) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `collect`
--

CREATE TABLE `collect` (
  `CollectID` int(30) UNSIGNED NOT NULL,
  `PostID` int(30) UNSIGNED NOT NULL,
  `Collected_count` int(30) UNSIGNED NOT NULL COMMENT '被收藏數'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `member`
--

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
  `Post_count` int(30) UNSIGNED DEFAULT NULL COMMENT '發過的貼文數'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `messageboard`
--

CREATE TABLE `messageboard` (
  `Message_boardID` int(30) UNSIGNED NOT NULL,
  `PostID` int(30) UNSIGNED NOT NULL,
  `MessagelogID` int(30) UNSIGNED DEFAULT NULL,
  `Message_Liked_count` int(30) UNSIGNED DEFAULT NULL COMMENT '留言點讚數'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `messagelog`
--

CREATE TABLE `messagelog` (
  `MessagelogID` int(30) UNSIGNED NOT NULL,
  `Message_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Message` varchar(1000) DEFAULT NULL,
  `Message_file` mediumblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `post`
--

CREATE TABLE `post` (
  `PostID` int(30) UNSIGNED NOT NULL,
  `PosterID` int(30) UNSIGNED NOT NULL COMMENT '發貼文的人',
  `Post_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Liked_count` int(30) UNSIGNED DEFAULT NULL COMMENT '按讚數',
  `Message_count` int(30) UNSIGNED DEFAULT NULL COMMENT '留言數',
  `Post_content` varchar(1000) DEFAULT NULL COMMENT '貼文內文'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `postphoto`
--

CREATE TABLE `postphoto` (
  `Post_photoID` int(30) UNSIGNED NOT NULL,
  `PostID` int(30) UNSIGNED NOT NULL,
  `Posted_photo` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `sticker`
--

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
  ADD KEY `PostID` (`PostID`);

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
  MODIFY `ChatroomID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `collect`
--
ALTER TABLE `collect`
  MODIFY `CollectID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `member`
--
ALTER TABLE `member`
  MODIFY `MemberID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
-- 使用資料表自動遞增(AUTO_INCREMENT) `post`
--
ALTER TABLE `post`
  MODIFY `PostID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `postphoto`
--
ALTER TABLE `postphoto`
  MODIFY `Post_photoID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `sticker`
--
ALTER TABLE `sticker`
  MODIFY `StickerID` int(30) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

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
  ADD CONSTRAINT `collect_ibfk_2` FOREIGN KEY (`PostID`) REFERENCES `post` (`PostID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `messageboard`
--
ALTER TABLE `messageboard`
  ADD CONSTRAINT `messageboard_ibfk_4` FOREIGN KEY (`MessagelogID`) REFERENCES `messagelog` (`MessagelogID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messageboard_ibfk_5` FOREIGN KEY (`PostID`) REFERENCES `post` (`PostID`) ON DELETE CASCADE ON UPDATE CASCADE;

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
