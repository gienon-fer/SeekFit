package hr.fer.seekfit.socialmanagement.domain.validation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "friendship_validation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipValidationEntity {

  @Id
  @Column(name = "friendship_id", nullable = false, unique = true, updatable = false)
  private String friendshipId;
}
