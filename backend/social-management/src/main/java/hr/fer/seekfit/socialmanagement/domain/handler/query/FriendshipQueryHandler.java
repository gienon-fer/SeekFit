package hr.fer.seekfit.socialmanagement.domain.handler.query;

import hr.fer.seekfit.socialmanagement.domain.api.query.friendship.GetFriendshipByIdQuery;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.FriendshipProjectionRepository;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.FriendshipResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.queryhandling.QueryHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FriendshipQueryHandler {

  private final FriendshipProjectionRepository friendshipProjectionRepository;

  @QueryHandler
  public FriendshipResponseDto handle(GetFriendshipByIdQuery query) {
    var entity = friendshipProjectionRepository.findById(query.friendshipId())
        .orElseThrow(() -> new RuntimeException("Friendship not found"));

    var dto = new FriendshipResponseDto();
    dto.setFriendshipId(entity.getFriendshipId());
    dto.setRequesterId(entity.getRequesterId());
    dto.setRecipientId(entity.getRecipientId());
    dto.setStatus(entity.getStatus());
    return dto;
  }
}
