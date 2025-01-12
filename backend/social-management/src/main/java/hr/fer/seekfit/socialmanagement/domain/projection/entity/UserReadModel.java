package hr.fer.seekfit.socialmanagement.domain.projection.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "USER_READ_MODEL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserReadModel {

  @Id
  private String userId;

  private String name;
}
