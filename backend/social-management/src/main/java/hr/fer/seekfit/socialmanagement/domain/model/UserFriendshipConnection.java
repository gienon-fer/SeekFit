package hr.fer.seekfit.socialmanagement.domain.model;

import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.AcceptFriendRequestCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.IgnoreFriendRequestCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.RemoveFriendCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.friendship.SendFriendRequestCommand;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRemovedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRequestAcceptedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRequestIgnoredEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.friendship.FriendRequestSentEvent;
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

  @CommandHandler
  public UserFriendshipConnection(SendFriendRequestCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @CommandHandler
  public void handle(AcceptFriendRequestCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @CommandHandler
  public void handle(IgnoreFriendRequestCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @CommandHandler
  public void handle(RemoveFriendCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(FriendRequestSentEvent event) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(FriendRequestAcceptedEvent event) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(FriendRequestIgnoredEvent event) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(FriendRemovedEvent event) {
    throw new UnsupportedOperationException();
  }
}
