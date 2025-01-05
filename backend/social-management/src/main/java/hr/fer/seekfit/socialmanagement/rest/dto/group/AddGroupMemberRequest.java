package hr.fer.seekfit.socialmanagement.rest.dto.group;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for adding a user to a group.
 */
@Data
@Schema(description = "DTO for adding a user to a group.")
public class AddGroupMemberRequest {

  @NotBlank(message = "The group ID is required.")
  @Schema(description = "The ID of the group.")
  private String groupId;

  @NotBlank(message = "The user ID is required.")
  @Schema(description = "The ID of the user to add.")
  private String userId;
}
