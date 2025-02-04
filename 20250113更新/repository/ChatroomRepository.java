package tw.topic.memberdata.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tw.topic.memberdata.model.Chatroom;

@Repository
public interface ChatroomRepository extends JpaRepository<Chatroom, Long> {
    Optional<Chatroom> findByMemberaAndMemberb(Long membera, Long memberb);
    List<Chatroom> findByMemberaOrMemberb(Long membera, Long memberb);
}