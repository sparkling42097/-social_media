package com.scott.chat.repository;

public interface LikeRepository {
    boolean existsLike(Integer postId, Integer memberId);
    void addLike(Integer postId, Integer memberId);
    void removeLike(Integer postId, Integer memberId);
}
