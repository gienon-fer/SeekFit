package hr.fer.seekfit.socialmanagement.rest.dto.group;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for removing a user from a group.
 */
@Data
@Schema(description = "DTO for removing a user from a group.")
public class RemoveGroupMemberRequest {

  @NotBlank(message = "The group ID is required.")
  @Schema(description = "The ID of the group.")
  private String groupId;

  @NotBlank(message = "The user ID is required.")
  @Schema(description = "The ID of the user to remove.")
  private String userId;
}
