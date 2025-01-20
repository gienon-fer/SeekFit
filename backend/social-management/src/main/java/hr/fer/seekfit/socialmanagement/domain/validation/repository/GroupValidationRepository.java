package hr.fer.seekfit.socialmanagement.domain.validation.repository;

import hr.fer.seekfit.socialmanagement.domain.validation.entity.GroupValidationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupValidationRepository extends JpaRepository<GroupValidationEntity, String> {

  boolean existsByGroupId(String groupId);
  boolean existsByName(String name);
}
