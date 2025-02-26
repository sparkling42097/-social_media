package com.scott.chat.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.scott.chat.repository.LikeRepository;

@Repository
public class LikeRepositoryImpl implements LikeRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public boolean existsLike(Integer postId, Integer memberId) {
        String sql = "SELECT COUNT(*) FROM member_likes WHERE post_id = ? AND member_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, postId, memberId);
        return count != null && count > 0;
    }
    
    @Override
    public void addLike(Integer postId, Integer memberId) {
        try {
            String sql = "INSERT INTO member_likes (post_id, member_id) VALUES (?, ?)";
            jdbcTemplate.update(sql, postId, memberId);
        } catch (org.springframework.dao.DuplicateKeyException e) {
            // 如果記錄已存在，忽略錯誤
        }
    }
    
    @Override
    public void removeLike(Integer postId, Integer memberId) {
        String sql = "DELETE FROM member_likes WHERE post_id = ? AND member_id = ?";
        jdbcTemplate.update(sql, postId, memberId);
    }
}
