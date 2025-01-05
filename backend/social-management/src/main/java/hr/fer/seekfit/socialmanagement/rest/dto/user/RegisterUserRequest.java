package hr.fer.seekfit.socialmanagement.rest.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "DTO object which contains data required to register a new user.")
public class RegisterUserRequest {

  @NotBlank(message = "The name of the user is required.")
  @Schema(description = "The name of the user.")
  private String name;
}
