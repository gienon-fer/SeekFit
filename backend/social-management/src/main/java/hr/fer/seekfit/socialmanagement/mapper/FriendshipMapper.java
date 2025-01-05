package hr.fer.seekfit.socialmanagement.mapper;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.AcceptFriendRequestCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.IgnoreFriendRequestCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.RemoveFriendCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.SendFriendRequestCommand;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.AcceptFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.IgnoreFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.RemoveFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.SendFriendRequest;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * Maps Friendship-related DTOs to domain commands.
 */
@Mapper(componentModel = SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FriendshipMapper {

  SendFriendRequestCommand toSendFriendRequestCommand(SendFriendRequest request, String friendshipId);

  AcceptFriendRequestCommand toAcceptFriendRequestCommand(AcceptFriendRequest request);

  IgnoreFriendRequestCommand toIgnoreFriendRequestCommand(IgnoreFriendRequest request);

  RemoveFriendCommand toRemoveFriendCommand(RemoveFriendRequest request);
}
