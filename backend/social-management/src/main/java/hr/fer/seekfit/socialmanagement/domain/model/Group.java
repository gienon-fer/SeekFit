package hr.fer.seekfit.socialmanagement.domain.model;

import hr.fer.seekfit.socialmanagement.domain.api.command.group.AddGroupMemberCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.ChangeGroupDetailsCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.CreateGroupCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.JoinGroupCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.LeaveGroupCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.RemoveGroupMemberCommand;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupCreatedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupDetailsChangedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupMemberAddedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupMemberRemovedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.UserJoinedGroupEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.UserLeftGroupEvent;
import java.util.List;
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
public class Group {

  @AggregateIdentifier
  private String groupId;
  private String ownerId;
  private String name;
  private String description;
  private List<String> members;

  @CommandHandler
  public Group(CreateGroupCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @CommandHandler
  public void handle(ChangeGroupDetailsCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @CommandHandler
  public void handle(AddGroupMemberCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @CommandHandler
  public void handle(RemoveGroupMemberCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @CommandHandler
  public void handle(JoinGroupCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @CommandHandler
  public void handle(LeaveGroupCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(GroupCreatedEvent event) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(GroupDetailsChangedEvent event) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(GroupMemberAddedEvent event) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(GroupMemberRemovedEvent event) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(UserJoinedGroupEvent event) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(UserLeftGroupEvent event) {
    throw new UnsupportedOperationException();
  }

}
