package hr.fer.seekfit.socialmanagement.rest.dto.group;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for joining a group via invitation link.
 */
@Data
@Schema(description = "DTO for joining a group via an invitation link.")
public class JoinGroupRequest {

  @NotBlank(message = "The group ID is required.")
  @Schema(description = "The ID of the group to join.")
  private String groupId;

  @NotBlank(message = "The invitation link ID is required.")
  @Schema(description = "The invitation link ID.")
  private String linkId;

  @NotBlank(message = "The user ID is required.")
  @Schema(description = "The ID of the user who is joining.")
  private String userId;
}
