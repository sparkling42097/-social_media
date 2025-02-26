package com.scott.chat.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.scott.chat.model.PostPhoto;

@Repository
public interface PostPhotoRepository extends JpaRepository<PostPhoto, Integer> {
    List<PostPhoto> findByPostid(Integer postId);
}