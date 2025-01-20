package hr.fer.seekfit.socialmanagement.domain.model;

import static hr.fer.seekfit.socialmanagement.domain.common.FriendshipStatus.ACCEPTED;
import static hr.fer.seekfit.socialmanagement.domain.common.FriendshipStatus.IGNORED;
import static hr.fer.seekfit.socialmanagement.domain.common.FriendshipStatus.PENDING;
import static org.axonframework.modelling.command.AggregateLifecycle.apply;
import static org.axonframework.modelling.command.AggregateLifecycle.markDeleted;

import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.AcceptFriendRequestCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.IgnoreFriendRequestCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.RemoveFriendCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.SendFriendRequestCommand;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRemovedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRequestAcceptedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRequestIgnoredEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRequestSentEvent;
import hr.fer.seekfit.socialmanagement.domain.common.FriendshipStatus;
import hr.fer.seekfit.socialmanagement.domain.exception.DomainException;
import hr.fer.seekfit.socialmanagement.domain.validation.repository.UserValidationRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.axonframework.commandhandling.CommandHandler;
import org.axonframework.eventsourcing.EventSourcingHandler;
import org.axonframework.modelling.command.AggregateIdentifier;
import org.axonframework.serialization.Revision;
import org.axonframework.spring.stereotype.Aggregate;

@Aggregate
@Revision("1.0")
@Builder
@EqualsAndHashCode(callSuper = false)
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class UserFriendshipConnection {

  @AggregateIdentifier
  private String friendshipConnectionId;

  /**
   * Possible states: PENDING, ACCEPTED, IGNORED
   */
  private FriendshipStatus status;
  private String requesterId;
  private String recipientId;

  @CommandHandler
  public UserFriendshipConnection(SendFriendRequestCommand cmd,
                                  UserValidationRepository userValidationRepository) {

    if (!userValidationRepository.existsByUserId(cmd.requesterId())) {
      throw new DomainException("Requester with ID " + cmd.requesterId() + " does not exist.");
    }
    if (!userValidationRepository.existsByUserId(cmd.recipientId())) {
      throw new DomainException("Recipient with ID " + cmd.recipientId() + " does not exist.");
    }
    if (cmd.requesterId().equals(cmd.recipientId())) {
      throw new DomainException("Requester and recipient must be distinct users.");
    }

    // Everything is fine
    apply(new FriendRequestSentEvent(cmd.friendshipId(), cmd.requesterId(), cmd.recipientId()));
  }

  @CommandHandler
  public void handle(AcceptFriendRequestCommand cmd) {
    if (PENDING != this.status) {
      throw new DomainException("Cannot accept a friend request that is not in PENDING state.");
    }

    apply(new FriendRequestAcceptedEvent(cmd.friendshipId()));
  }

  @CommandHandler
  public void handle(IgnoreFriendRequestCommand cmd) {
    if (PENDING != this.status) {
      throw new DomainException("Cannot ignore a friend request that is not in PENDING state.");
    }

    apply(new FriendRequestIgnoredEvent(cmd.friendshipId()));
  }

  @CommandHandler
  public void handle(RemoveFriendCommand cmd) {
    if (ACCEPTED != this.status) {
      throw new DomainException("Cannot remove a friendship that is not in ACCEPTED state.");
    }
    apply(new FriendRemovedEvent(cmd.friendshipId()));
  }

  @EventSourcingHandler
  public void on(FriendRequestSentEvent event) {
    this.friendshipConnectionId = event.friendshipId();
    this.requesterId = event.requesterId();
    this.recipientId = event.recipientId();
    this.status = PENDING;
  }

  @EventSourcingHandler
  public void on(FriendRequestAcceptedEvent event) {
    this.status = ACCEPTED;
  }

  @EventSourcingHandler
  public void on(FriendRequestIgnoredEvent event) {
    this.status = IGNORED;
  }

  @EventSourcingHandler
  public void on(FriendRemovedEvent event) {
    markDeleted();
  }
}
