package hr.fer.seekfit.socialmanagement.rest.dto.group;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for creating a new group.
 */
@Data
@Schema(description = "DTO for creating a new group.")
public class CreateGroupRequest {

  @NotBlank(message = "The group owner's ID is required.")
  @Schema(description = "The ID of the user who owns the group.")
  private String ownerId;

  @NotBlank(message = "The group name is required.")
  @Schema(description = "The name of the group.")
  private String name;

  @Schema(description = "The description of the group.")
  private String description;
}
