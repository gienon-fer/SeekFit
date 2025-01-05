package hr.fer.seekfit.socialmanagement.mapper;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

import hr.fer.seekfit.socialmanagement.domain.api.command.group.AddGroupMemberCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.ChangeGroupDetailsCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.CreateGroupCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.JoinGroupCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.LeaveGroupCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.RemoveGroupMemberCommand;
import hr.fer.seekfit.socialmanagement.rest.dto.group.AddGroupMemberRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.ChangeGroupDetailsRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.CreateGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.JoinGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.LeaveGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.RemoveGroupMemberRequest;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * Maps Group-related DTOs to domain commands.
 */
@Mapper(componentModel = SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface GroupMapper {

  CreateGroupCommand toCreateGroupCommand(CreateGroupRequest request, String groupId);

  ChangeGroupDetailsCommand toChangeGroupDetailsCommand(ChangeGroupDetailsRequest request);

  AddGroupMemberCommand toAddGroupMemberCommand(AddGroupMemberRequest request);

  RemoveGroupMemberCommand toRemoveGroupMemberCommand(RemoveGroupMemberRequest request);

  JoinGroupCommand toJoinGroupCommand(JoinGroupRequest request);

  LeaveGroupCommand toLeaveGroupCommand(LeaveGroupRequest request);
}
