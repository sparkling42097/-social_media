UPDATE `post` 
SET `Message_count` = CASE PostID
    WHEN 1 THEN '8'
    WHEN 5 THEN '5'
ELSE `Message_count` END;