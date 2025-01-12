package hr.fer.seekfit.socialmanagement.domain.validation.repository;

import hr.fer.seekfit.socialmanagement.domain.validation.entity.UserValidationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserValidationRepository extends JpaRepository<UserValidationEntity, String> {
  boolean existsByUserId(String userId);
  boolean existsByName(String name);
}
