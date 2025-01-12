package hr.fer.seekfit.socialmanagement.domain.projection.repository;

import hr.fer.seekfit.socialmanagement.domain.projection.entity.GroupReadModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupProjectionRepository extends JpaRepository<GroupReadModel, String> {
}
