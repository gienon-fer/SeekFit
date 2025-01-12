package hr.fer.seekfit.socialmanagement.rest.dto.group;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for changing group details (name or description).
 */
//TODO create value object for GroupDetails
@Data
@Schema(description = "DTO for changing group details.")
public class ChangeGroupDetailsRequest {

  @NotBlank(message = "The group ID is required.")
  @Schema(description = "The ID of the group to be changed.")
  private String groupId;

  @Schema(description = "The new name of the group (optional).")
  private String name;

  @Schema(description = "The new description of the group (optional).")
  private String description;
}
