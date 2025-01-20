package hr.fer.seekfit.socialmanagement.domain.validation.repository;

import hr.fer.seekfit.socialmanagement.domain.validation.entity.FriendshipValidationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendshipValidationRepository extends JpaRepository<FriendshipValidationEntity, String> {
  boolean existsByFriendshipId(String friendshipId);
}
