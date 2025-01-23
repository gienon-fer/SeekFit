package hr.fer.seekfit.socialmanagement.domain.projection.repository;

import hr.fer.seekfit.socialmanagement.domain.projection.entity.FriendshipReadModel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendshipProjectionRepository extends JpaRepository<FriendshipReadModel, String> {
  List<FriendshipReadModel> findByRequesterIdOrRecipientId(String requesterId, String recipientId);
}
