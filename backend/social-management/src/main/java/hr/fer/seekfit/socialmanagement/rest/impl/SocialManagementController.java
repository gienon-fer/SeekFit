package hr.fer.seekfit.socialmanagement.rest.impl;

import static org.springframework.http.HttpStatus.ACCEPTED;

import hr.fer.seekfit.socialmanagement.mapper.FriendshipMapper;
import hr.fer.seekfit.socialmanagement.mapper.GroupMapper;
import hr.fer.seekfit.socialmanagement.mapper.UserMapper;
import hr.fer.seekfit.socialmanagement.rest.api.SocialManagementControllerApiDocks;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.AcceptFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.FriendshipIdDto;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.IgnoreFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.RemoveFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.SendFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.AddGroupMemberRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.ChangeGroupDetailsRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.CreateGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.GroupIdDto;
import hr.fer.seekfit.socialmanagement.rest.dto.group.JoinGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.LeaveGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.RemoveGroupMemberRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RegisterUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RenameUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.UserIdDto;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.commandhandling.gateway.CommandGateway;
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
@RequestMapping("/api/social/v1")
public class SocialManagementController implements SocialManagementControllerApiDocks {

  private final CommandGateway commandGateway;
  private final UserMapper userMapper;
  private final GroupMapper groupMapper;
  private final FriendshipMapper friendshipMapper;

  /* -------------------- User Commands -------------------- */
  @Override
  @PostMapping("/register-user")
  @ResponseStatus(ACCEPTED)
  public UserIdDto registerUser(@Valid @RequestBody RegisterUserRequest request) {
    var userId = UUID.randomUUID().toString();
    var command = userMapper.toRegisterUserCommand(request, userId);
    commandGateway.sendAndWait(command);
    return new UserIdDto(userId);
  }

  @Override
  @PostMapping("/rename-user")
  @ResponseStatus(ACCEPTED)
  public UserIdDto renameUser(@Valid @RequestBody RenameUserRequest request) {
    var command = userMapper.toRenameUserCommand(request);
    commandGateway.sendAndWait(command);
    return new UserIdDto(request.getUserId());
  }

  /* ------------------- Group Commands -------------------- */
  @Override
  @PostMapping("/create-group")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto createGroup(@Valid @RequestBody CreateGroupRequest request) {
    var groupId = UUID.randomUUID().toString();
    var command = groupMapper.toCreateGroupCommand(request, groupId);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(groupId);
  }

  @Override
  @PostMapping("/change-group-details")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto changeGroupDetails(@Valid @RequestBody ChangeGroupDetailsRequest request) {
    var command = groupMapper.toChangeGroupDetailsCommand(request);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(request.getGroupId());
  }

  @Override
  @PostMapping("/add-group-member")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto addGroupMember(@Valid @RequestBody AddGroupMemberRequest request) {
    var command = groupMapper.toAddGroupMemberCommand(request);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(request.getGroupId());
  }

  @Override
  @PostMapping("/remove-group-member")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto removeGroupMember(@Valid @RequestBody RemoveGroupMemberRequest request) {
    var command = groupMapper.toRemoveGroupMemberCommand(request);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(request.getGroupId());
  }

  @Override
  @PostMapping("/join-group")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto joinGroup(@Valid @RequestBody JoinGroupRequest request) {
    var command = groupMapper.toJoinGroupCommand(request);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(request.getGroupId());
  }

  @Override
  @PostMapping("/leave-group")
  @ResponseStatus(ACCEPTED)
  public GroupIdDto leaveGroup(@Valid @RequestBody LeaveGroupRequest request) {
    var command = groupMapper.toLeaveGroupCommand(request);
    commandGateway.sendAndWait(command);
    return new GroupIdDto(request.getGroupId());
  }

  /* ---------------- Friendship Commands ------------------ */
  @Override
  @PostMapping("/send-friend-request")
  @ResponseStatus(ACCEPTED)
  public FriendshipIdDto sendFriendRequest(@Valid @RequestBody SendFriendRequest request) {
    var friendshipId = UUID.randomUUID().toString();
    var command = friendshipMapper.toSendFriendRequestCommand(request, friendshipId);
    commandGateway.sendAndWait(command);
    return new FriendshipIdDto(friendshipId);
  }

  @Override
  @PostMapping("/accept-friend-request")
  @ResponseStatus(ACCEPTED)
  public FriendshipIdDto acceptFriendRequest(@Valid @RequestBody AcceptFriendRequest request) {
    var command = friendshipMapper.toAcceptFriendRequestCommand(request);
    commandGateway.sendAndWait(command);
    return new FriendshipIdDto(request.getFriendshipId());
  }

  @Override
  @PostMapping("/ignore-friend-request")
  @ResponseStatus(ACCEPTED)
  public FriendshipIdDto ignoreFriendRequest(@Valid @RequestBody IgnoreFriendRequest request) {
    var command = friendshipMapper.toIgnoreFriendRequestCommand(request);
    commandGateway.sendAndWait(command);
    return new FriendshipIdDto(request.getFriendshipId());
  }

  @Override
  @PostMapping("/remove-friend")
  @ResponseStatus(ACCEPTED)
  public FriendshipIdDto removeFriend(@Valid @RequestBody RemoveFriendRequest request) {
    var command = friendshipMapper.toRemoveFriendCommand(request);
    commandGateway.sendAndWait(command);
    return new FriendshipIdDto(request.getFriendshipId());
  }
}
