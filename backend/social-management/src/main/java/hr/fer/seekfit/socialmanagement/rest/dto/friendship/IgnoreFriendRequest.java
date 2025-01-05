package hr.fer.seekfit.socialmanagement.rest.dto.friendship;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for ignoring a friend request.
 */
@Data
@Schema(description = "DTO for ignoring a friend request.")
public class IgnoreFriendRequest {

  @NotBlank(message = "The friendship ID is required.")
  @Schema(description = "Unique identifier for the friendship.")
  private String friendshipId;
}
