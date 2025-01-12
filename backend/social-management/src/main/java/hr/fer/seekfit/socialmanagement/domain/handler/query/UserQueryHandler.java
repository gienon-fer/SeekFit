package hr.fer.seekfit.socialmanagement.domain.handler.query;

import hr.fer.seekfit.socialmanagement.domain.api.query.friendship.GetUserFriendsQuery;
import hr.fer.seekfit.socialmanagement.domain.api.query.user.GetUserByIdQuery;
import hr.fer.seekfit.socialmanagement.domain.projection.entity.UserReadModel;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.FriendshipProjectionRepository;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.UserProjectionRepository;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.FriendshipSummaryDto;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.UserFriendsListDto;
import hr.fer.seekfit.socialmanagement.rest.dto.user.UserResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.queryhandling.QueryHandler;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserQueryHandler {

  private final UserProjectionRepository userProjectionRepository;
  private final FriendshipProjectionRepository friendshipProjectionRepository;

  @QueryHandler
  public UserResponseDto handle(GetUserByIdQuery query) {
    var userEntity = userProjectionRepository.findById(query.userId())
        .orElseThrow(() -> new RuntimeException("User not found"));
    var dto = new UserResponseDto();
    dto.setUserId(userEntity.getUserId());
    dto.setName(userEntity.getName());
    return dto;
  }

  @QueryHandler
  public UserFriendsListDto handle(GetUserFriendsQuery query) {
    // Find all friendships where user is either requester or recipient
    var friendships = friendshipProjectionRepository.findByRequesterIdOrRecipientId(query.userId(), query.userId());

    var response = new UserFriendsListDto();
    response.setUserId(query.userId());

    // Convert to a list of FriendshipShortDto
    var friendDtoList = friendships.stream().filter(fr -> fr.getStatus().equals("ACCEPTED"))
        .map(fr -> {
          // The "other" user in the friendship
          String friendId = fr.getRequesterId().equals(query.userId())
              ? fr.getRecipientId()
              : fr.getRequesterId();

          // Potentially fetch the user entity to get a name
          var friendEntity = userProjectionRepository.findById(friendId);
          var shortDto = new FriendshipSummaryDto();
          shortDto.setFriendId(friendId);
          shortDto.setFriendName(friendEntity.map(UserReadModel::getName).orElse("Unknown"));
          return shortDto;
        }).collect(Collectors.toList());

    response.setFriends(friendDtoList);
    return response;
  }
}
