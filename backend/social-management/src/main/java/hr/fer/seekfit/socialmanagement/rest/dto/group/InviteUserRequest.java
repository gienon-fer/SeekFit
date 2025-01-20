package hr.fer.seekfit.socialmanagement.rest.dto.group;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "DTO for inviting a user to a group.")
public class InviteUserRequest {

  @NotBlank(message = "The group ID is required.")
  @Schema(description = "The ID of the group.")
  private String groupId;

  @NotBlank(message = "The user ID to invite is required.")
  @Schema(description = "The ID of the user to invite.")
  private String userId;
}
