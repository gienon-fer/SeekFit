package hr.fer.seekfit.socialmanagement.mapper;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

import hr.fer.seekfit.socialmanagement.domain.api.command.user.RegisterUserCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.user.RenameUserCommand;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RegisterUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RenameUserRequest;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

  RegisterUserCommand toRegisterUserCommand(RegisterUserRequest request, String userId);
  RenameUserCommand toRenameUserCommand(RenameUserRequest request);
}
