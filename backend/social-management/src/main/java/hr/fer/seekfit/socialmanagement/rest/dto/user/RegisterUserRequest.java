package hr.fer.seekfit.socialmanagement.rest.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "DTO object which contains data required to register a new user.")
public class RegisterUserRequest {

  @NotBlank(message = "The name of the user is required.")
  @Schema(description = "The name of the user.")
  @Size(max = 200, message = "The user name can not be longer than 200 symbols.")
  private String name;
}
