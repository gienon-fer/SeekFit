package hr.fer.seekfit.socialmanagement.domain.projection.repository;

import hr.fer.seekfit.socialmanagement.domain.projection.entity.UserReadModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProjectionRepository extends JpaRepository<UserReadModel, String> {
}
