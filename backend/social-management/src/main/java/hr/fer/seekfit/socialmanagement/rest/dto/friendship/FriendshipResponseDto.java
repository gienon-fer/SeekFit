package hr.fer.seekfit.socialmanagement.rest.dto.friendship;

import lombok.Data;

@Data
public class FriendshipResponseDto {
  private String friendshipId;
  private String requesterId;
  private String recipientId;
  private String status; // PENDING, ACCEPTED, IGNORED
}