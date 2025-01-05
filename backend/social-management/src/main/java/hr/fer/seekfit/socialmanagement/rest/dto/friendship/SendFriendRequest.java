package hr.fer.seekfit.socialmanagement.rest.dto.friendship;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for sending a friend request.
 */
@Data
@Schema(description = "DTO for sending a friend request.")
public class SendFriendRequest {

  @NotBlank(message = "The requester ID is required.")
  @Schema(description = "ID of the user who sends the request.")
  private String requesterId;

  @NotBlank(message = "The recipient ID is required.")
  @Schema(description = "ID of the user who receives the request.")
  private String recipientId;
}
