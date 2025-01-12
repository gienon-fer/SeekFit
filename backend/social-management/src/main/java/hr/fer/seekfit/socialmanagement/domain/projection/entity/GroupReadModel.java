package hr.fer.seekfit.socialmanagement.domain.projection.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "GROUP_READ_MODEL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupReadModel {

  @Id
  private String groupId;

  private String ownerId;
  private String name;
  private String description;
}
