package hr.fer.seekfit.socialmanagement.domain.validation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "user_validation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserValidationEntity {

  @Id
  @Column(name = "user_id", nullable = false, unique = true, updatable = false)
  private String userId;

  @Column(name = "name", nullable = false, unique = true)
  private String name;
}
