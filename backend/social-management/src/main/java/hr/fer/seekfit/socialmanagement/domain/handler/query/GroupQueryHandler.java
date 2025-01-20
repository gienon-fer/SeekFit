package hr.fer.seekfit.socialmanagement.domain.handler.query;

import hr.fer.seekfit.socialmanagement.domain.api.query.group.GetGroupByIdQuery;
import hr.fer.seekfit.socialmanagement.domain.api.query.group.GetGroupMembersQuery;

import hr.fer.seekfit.socialmanagement.domain.projection.entity.UserReadModel;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.GroupMemberProjectionRepository;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.GroupProjectionRepository;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.UserProjectionRepository;
import hr.fer.seekfit.socialmanagement.rest.dto.group.GroupMemberResponseDto;
import hr.fer.seekfit.socialmanagement.rest.dto.group.GroupMembersListDto;
import hr.fer.seekfit.socialmanagement.rest.dto.group.GroupResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.queryhandling.QueryHandler;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class GroupQueryHandler {

  private final GroupProjectionRepository groupProjectionRepository;
  private final GroupMemberProjectionRepository groupMemberProjectionRepository;
  private final UserProjectionRepository userProjectionRepository;

  @QueryHandler
  public GroupResponseDto handle(GetGroupByIdQuery query) {
    var groupEntity = groupProjectionRepository.findById(query.groupId())
        .orElseThrow(() -> new RuntimeException("Group not found"));

    var dto = new GroupResponseDto();
    dto.setGroupId(groupEntity.getGroupId());
    dto.setOwnerId(groupEntity.getOwnerId());
    dto.setName(groupEntity.getName());
    dto.setDescription(groupEntity.getDescription());
    return dto;
  }

  @QueryHandler
  public GroupMembersListDto handle(GetGroupMembersQuery query) {
    var groupMembers = groupMemberProjectionRepository.findByGroupId(query.groupId());
    var response = new GroupMembersListDto();
    response.setGroupId(query.groupId());

    var membersDtoList = groupMembers.stream().map(member -> {
      var dto = new GroupMemberResponseDto();
      dto.setUserId(member.getUserId());
      dto.setJoinedAt(member.getJoinedAt() != null ? member.getJoinedAt().toString() : null);

      // Optionally fetch username
      var userEntity = userProjectionRepository.findById(member.getUserId());
      dto.setUserName(userEntity.map(UserReadModel::getName).orElse("Unknown"));

      return dto;
    }).collect(Collectors.toList());

    response.setMembers(membersDtoList);
    return response;
  }
}
