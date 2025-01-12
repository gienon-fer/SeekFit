package hr.fer.seekfit.socialmanagement.domain.projection.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "GROUP_MEMBER_READ_MODEL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberReadModel {

  @Id
  private Long id;

  private String groupId;
  private String userId;
  private LocalDateTime joinedAt;
}
