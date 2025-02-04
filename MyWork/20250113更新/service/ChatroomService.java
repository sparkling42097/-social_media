package tw.topic.memberdata.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tw.topic.memberdata.model.Chatroom;
import tw.topic.memberdata.repository.ChatroomRepository;

@Service
@Transactional
public class ChatroomService {
    @Autowired
    private ChatroomRepository chatroomRepository;

    public Chatroom getOrCreateChatroom(Long member1Id, Long member2Id) {
        // 確保順序一致性
        Long smallerId = Math.min(member1Id, member2Id);
        Long largerId = Math.max(member1Id, member2Id);

        return chatroomRepository.findByMemberaAndMemberb(smallerId, largerId)
            .orElseGet(() -> {
                Chatroom newChatroom = new Chatroom();
                newChatroom.setMembera(smallerId);
                newChatroom.setMemberb(largerId);
                return chatroomRepository.save(newChatroom);
            });
    }

    // 取得使用者的所有聊天室
    public List<Chatroom> getMemberChatrooms(Long memberId) {
        return chatroomRepository.findByMemberaOrMemberb(memberId, memberId);
    }
}