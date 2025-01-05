package hr.fer.seekfit.socialmanagement.rest.impl;

import static org.springframework.http.HttpStatus.ACCEPTED;

import hr.fer.seekfit.socialmanagement.mapper.UserMapper;
import hr.fer.seekfit.socialmanagement.rest.api.SocialManagementControllerApiDocks;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RegisterUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.UserIdDto;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.commandhandling.gateway.CommandGateway;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/social/v1")
public class SocialManagementController implements SocialManagementControllerApiDocks {

  private final CommandGateway commandGateway;
  private final UserMapper userMapper;


  @Override
  @PostMapping("/register-user")
  @ResponseStatus(ACCEPTED)
  public UserIdDto registerUser(RegisterUserRequest registerUserRequest) {
    var userId = UUID.randomUUID().toString();
    commandGateway.sendAndWait(userMapper.toDto(registerUserRequest, userId));
    return new UserIdDto(userId);
  }

}