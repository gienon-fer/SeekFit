package hr.fer.seekfit.socialmanagement.rest.dto.friendship;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for accepting a friend request.
 */
@Data
@Schema(description = "DTO for accepting a friend request.")
public class AcceptFriendRequest {

  @NotBlank(message = "The friendship ID is required.")
  @Schema(description = "Unique identifier for the friendship.")
  private String friendshipId;
}
