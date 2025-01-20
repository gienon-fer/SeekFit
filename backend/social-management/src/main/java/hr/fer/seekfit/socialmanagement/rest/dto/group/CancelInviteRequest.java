package hr.fer.seekfit.socialmanagement.rest.dto.group;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "DTO for cancelling a user's invitation to a group.")
public class CancelInviteRequest {

  @NotBlank(message = "The group ID is required.")
  @Schema(description = "The ID of the group.")
  private String groupId;

  @NotBlank(message = "The user ID whose invitation is to be cancelled is required.")
  @Schema(description = "The ID of the user whose invitation is to be cancelled.")
  private String userId;
}
