package hr.fer.seekfit.socialmanagement.rest.controler.impl;

import static org.springframework.http.HttpStatus.ACCEPTED;

import hr.fer.seekfit.socialmanagement.domain.api.query.friendship.GetFriendshipByIdQuery;
import hr.fer.seekfit.socialmanagement.domain.api.query.friendship.GetUserFriendsQuery;
import hr.fer.seekfit.socialmanagement.domain.api.query.group.GetGroupByIdQuery;
import hr.fer.seekfit.socialmanagement.domain.api.query.group.GetGroupMembersQuery;
import hr.fer.seekfit.socialmanagement.domain.api.query.user.GetUserByIdQuery;
import hr.fer.seekfit.socialmanagement.mapper.FriendshipMapper;
import hr.fer.seekfit.socialmanagement.mapper.GroupMapper;
import hr.fer.seekfit.socialmanagement.mapper.UserMapper;
import hr.fer.seekfit.socialmanagement.rest.controler.api.SocialManagementControllerApiDocks;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.AcceptFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.FriendshipIdDto;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.FriendshipResponseDto;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.IgnoreFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.RemoveFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.SendFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.UserFriendsListDto;
import hr.fer.seekfit.socialmanagement.rest.dto.group.AddGroupMemberRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.CancelInviteRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.ChangeGroupDetailsRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.CreateGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.GroupIdDto;
import hr.fer.seekfit.socialmanagement.rest.dto.group.GroupMembersListDto;
import hr.fer.seekfit.socialmanagement.rest.dto.group.GroupResponseDto;
import hr.fer.seekfit.socialmanagement.rest.dto.group.InviteUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.JoinGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.LeaveGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.RemoveGroupMemberRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RegisterUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RenameUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.UserIdDto;
import hr.fer.seekfit.socialmanagement.rest.dto.user.UserResponseDto;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.commandhandling.gateway.CommandGateway;
import org.axonframework.queryhandling.QueryGateway;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller implementation for social management features.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class SocialManagementController implements SocialManagementControllerApiDocks {

  private final CommandGateway commandGateway;
  private final UserMapper userMapper;
  private final GroupMapper groupMapper;
  private final FriendshipMapper friendshipMapper;
  private final QueryGateway queryGateway;

  /* -------------------- User Commands -------------------- */
  @Override
  @PostMapping("/users/register")
  @ResponseStatus(ACCEPTED)
  public UserIdDto registerUser(@Valid @RequestBody RegisterUserRequest request) {
    var userId = UUID.randomUUID().toString();
    var command = userMapper.toRegisterUserCommand(request, userId);
    commandGateway.sendAndWait(command);
    return new UserIdDto(userId);
  }

  @Override
  @PostMapping("/users/rename")
  @ResponseStatus(ACCEPTED)
  public UserIdDto renameUser(@Valid @RequestBody RenameUserRequest request) {
    var command = userMapper.toRenameUserCommand(request);
    commandGateway.sendAndWait(command);
    return new UserIdDto(request.getUserId());
  }

  /* -------------------- Group Commands -------------------- */
  @Override
  @PostMapping("/groups/create")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto createGroup(@Valid @RequestBody CreateGroupRequest request) {
    var groupId = UUID.randomUUID().toString();
    var command = groupMapper.toCreateGroupCommand(request, groupId);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(groupId);
  }

  @Override
  @PostMapping("/groups/change-details")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto changeGroupDetails(@Valid @RequestBody ChangeGroupDetailsRequest request) {
    var command = groupMapper.toChangeGroupDetailsCommand(request);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(request.getGroupId());
  }

  @Override
  @PostMapping("/groups/add-member")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto addGroupMember(@Valid @RequestBody AddGroupMemberRequest request) {
    var command = groupMapper.toAddGroupMemberCommand(request);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(request.getGroupId());
  }

  @Override
  @PostMapping("/groups/remove-member")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto removeGroupMember(@Valid @RequestBody RemoveGroupMemberRequest request) {
    var command = groupMapper.toRemoveGroupMemberCommand(request);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(request.getGroupId());
  }

  @Override
  @PostMapping("/groups/invite-user")
  @ResponseStatus(ACCEPTED)
  public void inviteUser(@Valid @RequestBody InviteUserRequest request) {
    var command = groupMapper.toInviteUserCommand(request);
    commandGateway.sendAndWait(command);
  }

  @Override
  @PostMapping("/groups/cancel-invite")
  @ResponseStatus(ACCEPTED)
  public void cancelInvite(@Valid @RequestBody CancelInviteRequest request) {
    var command = groupMapper.toCancelInviteCommand(request);
    commandGateway.sendAndWait(command);
  }

  @Override
  @PostMapping("/groups/join")
  @ResponseStatus(ACCEPTED)
  public void joinGroup(@Valid @RequestBody JoinGroupRequest request) {
    var command = groupMapper.toJoinGroupCommand(request);
    commandGateway.sendAndWait(command);
  }

  @Override
  @PostMapping("/groups/leave")
  @ResponseStatus(ACCEPTED)
  public void leaveGroup(@Valid @RequestBody LeaveGroupRequest request) {
    var command = groupMapper.toLeaveGroupCommand(request);
    commandGateway.sendAndWait(command);
  }

  /* -------------------- Friendship Commands -------------------- */
  @Override
  @PostMapping("/friendships/send-request")
  @ResponseStatus(ACCEPTED)
  public FriendshipIdDto sendFriendRequest(@Valid @RequestBody SendFriendRequest request) {
    var friendshipId = UUID.randomUUID().toString();
    var command = friendshipMapper.toSendFriendRequestCommand(request, friendshipId);
    commandGateway.sendAndWait(command);
    return new FriendshipIdDto(friendshipId);
  }

  @Override
  @PostMapping("/friendships/accept-request")
  @ResponseStatus(ACCEPTED)
  public FriendshipIdDto acceptFriendRequest(@Valid @RequestBody AcceptFriendRequest request) {
    var command = friendshipMapper.toAcceptFriendRequestCommand(request);
    commandGateway.sendAndWait(command);
    return new FriendshipIdDto(request.getFriendshipId());
  }

  @Override
  @PostMapping("/friendships/ignore-request")
  @ResponseStatus(ACCEPTED)
  public FriendshipIdDto ignoreFriendRequest(@Valid @RequestBody IgnoreFriendRequest request) {
    var command = friendshipMapper.toIgnoreFriendRequestCommand(request);
    commandGateway.sendAndWait(command);
    return new FriendshipIdDto(request.getFriendshipId());
  }

  @Override
  @PostMapping("/friendships/remove")
  @ResponseStatus(ACCEPTED)
  public FriendshipIdDto removeFriend(@Valid @RequestBody RemoveFriendRequest request) {
    var command = friendshipMapper.toRemoveFriendCommand(request);
    commandGateway.sendAndWait(command);
    return new FriendshipIdDto(request.getFriendshipId());
  }

  /* -------------------- Query Endpoints -------------------- */
  @Override
  @GetMapping("/users/{userId}")
  @ResponseStatus(ACCEPTED)
  public UserResponseDto getUserById(@PathVariable String userId) {
    return queryGateway.query(new GetUserByIdQuery(userId), UserResponseDto.class).join();
  }

  @Override
  @GetMapping("/users/{userId}/friends")
  @ResponseStatus(ACCEPTED)
  public UserFriendsListDto getUserFriends(@PathVariable String userId) {
    return queryGateway.query(new GetUserFriendsQuery(userId), UserFriendsListDto.class).join();
  }

  @Override
  @GetMapping("/groups/{groupId}")
  @ResponseStatus(ACCEPTED)
  public GroupResponseDto getGroupById(@PathVariable String groupId) {
    return queryGateway.query(new GetGroupByIdQuery(groupId), GroupResponseDto.class).join();
  }

  @Override
  @GetMapping("/groups/{groupId}/members")
  @ResponseStatus(ACCEPTED)
  public GroupMembersListDto getGroupMembers(@PathVariable String groupId) {
    return queryGateway.query(new GetGroupMembersQuery(groupId), GroupMembersListDto.class).join();
  }

  @Override
  @GetMapping("/friendships/{friendshipId}")
  @ResponseStatus(ACCEPTED)
  public FriendshipResponseDto getFriendshipById(@PathVariable String friendshipId) {
    return queryGateway.query(new GetFriendshipByIdQuery(friendshipId), FriendshipResponseDto.class).join();
  }
}
