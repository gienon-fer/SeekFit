package hr.fer.seekfit.socialmanagement.rest.dto.group;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for leaving a group.
 */
@Data
@Schema(description = "DTO for leaving a group.")
public class LeaveGroupRequest {

  @NotBlank(message = "The group ID is required.")
  @Schema(description = "The ID of the group to leave.")
  private String groupId;

  @NotBlank(message = "The user ID is required.")
  @Schema(description = "The ID of the user who is leaving.")
  private String userId;
}
