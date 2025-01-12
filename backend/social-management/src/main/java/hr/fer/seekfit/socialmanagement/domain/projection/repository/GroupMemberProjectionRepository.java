package hr.fer.seekfit.socialmanagement.domain.projection.repository;


import hr.fer.seekfit.socialmanagement.domain.projection.entity.GroupMemberReadModel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberProjectionRepository extends JpaRepository<GroupMemberReadModel, Long> {
  List<GroupMemberReadModel> findByGroupId(String groupId);
  List<GroupMemberReadModel> findByUserId(String userId);
}
