package hr.fer.seekfit.socialmanagement.rest.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO object which contains data required to rename a user.
 */
@Data
@Schema(description = "DTO for renaming a user.")
public class RenameUserRequest {

  @NotBlank(message = "The user ID is required.")
  @Schema(description = "The ID of the user.")
  private String userId;

  @NotBlank(message = "The new name of the user is required.")
  @Schema(description = "The new name of the user.")
  @Size(max = 200, message = "The user name cannot exceed 200 characters.")
  private String newName;
}
