package hr.fer.seekfit.socialmanagement.domain.handler.event;

import static hr.fer.seekfit.socialmanagement.configuration.Constants.READ_MODEL_EVENT_PROCESSOR;

import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRemovedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRequestAcceptedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRequestIgnoredEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRequestSentEvent;
import hr.fer.seekfit.socialmanagement.domain.projection.entity.FriendshipReadModel;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.FriendshipProjectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.config.ProcessingGroup;
import org.axonframework.eventhandling.EventHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ProcessingGroup(READ_MODEL_EVENT_PROCESSOR)
@Slf4j
public class FriendshipReadModelEventHandler {

  private final FriendshipProjectionRepository friendshipProjectionRepository;

  @EventHandler
  public void on(FriendRequestSentEvent event) {
    log.info("Handling FriendRequestSentEvent, friendshipId={}", event.friendshipId());
    var friendship = new FriendshipReadModel();
    friendship.setFriendshipId(event.friendshipId());
    friendship.setRequesterId(event.requesterId());
    friendship.setRecipientId(event.recipientId());
    friendship.setStatus("PENDING");
    friendshipProjectionRepository.save(friendship);
  }

  @EventHandler
  public void on(FriendRequestAcceptedEvent event) {
    log.info("Handling FriendRequestAcceptedEvent, friendshipId={}", event.friendshipId());
    var friendship = friendshipProjectionRepository.findById(event.friendshipId())
        .orElseThrow(() -> new RuntimeException("Friendship not found"));
    friendship.setStatus("ACCEPTED");
    friendshipProjectionRepository.save(friendship);
  }

  @EventHandler
  public void on(FriendRequestIgnoredEvent event) {
    log.info("Handling FriendRequestIgnoredEvent, friendshipId={}", event.friendshipId());
    var friendship = friendshipProjectionRepository.findById(event.friendshipId())
        .orElseThrow(() -> new RuntimeException("Friendship not found"));
    friendship.setStatus("IGNORED");
    friendshipProjectionRepository.save(friendship);
  }

  @EventHandler
  public void on(FriendRemovedEvent event) {
    log.info("Handling FriendRemovedEvent, friendshipId={}", event.friendshipId());
    var friendship = friendshipProjectionRepository.findById(event.friendshipId())
        .orElseThrow(() -> new RuntimeException("Friendship not found"));
    friendshipProjectionRepository.delete(friendship);
  }
}
