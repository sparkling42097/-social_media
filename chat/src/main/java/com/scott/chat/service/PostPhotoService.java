package com.scott.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.scott.chat.model.PostPhoto;
import com.scott.chat.repository.PostPhotoRepository;
import java.util.List;

@Service
public class PostPhotoService {
    
    @Autowired
    private PostPhotoRepository postPhotoRepository;
    
    public PostPhoto save(PostPhoto postPhoto) {
        return postPhotoRepository.save(postPhoto);
    }
    
    public List<PostPhoto> findByPostId(Integer postId) {
        return postPhotoRepository.findByPostid(postId);
    }
    
    public PostPhoto savePostPhoto(Integer postId, MultipartFile file) {
        PostPhoto postPhoto = new PostPhoto();
        postPhoto.setPostid(postId);
        postPhoto.setPostedphotofile(file);
        return postPhotoRepository.save(postPhoto);
    }
    
    public void deleteByPostId(Integer postId) {
        List<PostPhoto> photos = findByPostId(postId);
        postPhotoRepository.deleteAll(photos);
    }
}
