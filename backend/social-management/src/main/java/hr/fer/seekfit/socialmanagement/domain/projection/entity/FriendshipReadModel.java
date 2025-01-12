package hr.fer.seekfit.socialmanagement.domain.projection.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "FRIENDSHIP_READ_MODEL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipReadModel {

  @Id
  private String friendshipId;

  private String requesterId;
  private String recipientId;
  //TODO List of invited people

  private String status;
}
