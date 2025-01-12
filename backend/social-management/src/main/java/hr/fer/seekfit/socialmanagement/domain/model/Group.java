package hr.fer.seekfit.socialmanagement.domain.model;

import static org.axonframework.modelling.command.AggregateLifecycle.apply;

import hr.fer.seekfit.socialmanagement.domain.api.command.group.AddGroupMemberCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.CancelInviteCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.ChangeGroupDetailsCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.CreateGroupCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.InviteUserCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.JoinGroupCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.LeaveGroupCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.group.RemoveGroupMemberCommand;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupCreatedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupDetailsChangedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupMemberAddedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupMemberRemovedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.UserInvitationCancelledEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.UserInvitedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.UserJoinedGroupEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.UserLeftGroupEvent;
import hr.fer.seekfit.socialmanagement.domain.exception.DomainException;
import hr.fer.seekfit.socialmanagement.domain.validation.repository.GroupValidationRepository;
import hr.fer.seekfit.socialmanagement.domain.validation.repository.UserValidationRepository;
import java.util.ArrayList;
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
  @Builder.Default
  private List<String> members = new ArrayList<>();
  @Builder.Default
  private List<String> invitedUsers = new ArrayList<>();

  @CommandHandler
  public Group(CreateGroupCommand cmd,
               GroupValidationRepository groupValidationRepository,
               UserValidationRepository userValidationRepository) {

    // ownerId must be a valid user
    if (!userValidationRepository.existsByUserId(cmd.ownerId())) {
      throw new DomainException("Owner with ID " + cmd.ownerId() + " does not exist.");
    }

    // name must be unique
    if (groupValidationRepository.existsByName(cmd.name())) {
      throw new DomainException("Group name '" + cmd.name() + "' is already taken.");
    }

    apply(new GroupCreatedEvent(cmd.groupId(), cmd.ownerId(), cmd.name(), cmd.description()));
  }

  @CommandHandler
  public void handle(ChangeGroupDetailsCommand cmd,
      GroupValidationRepository groupValidationRepository) {
    if (groupValidationRepository.existsByName(cmd.name())) {
      throw new DomainException("Group name '" + cmd.name() + "' is already taken.");
    }

    apply(new GroupDetailsChangedEvent(cmd.groupId(), cmd.name(), cmd.description()));
  }

  @CommandHandler
  public void handle(AddGroupMemberCommand cmd, UserValidationRepository userValidationRepository) {
    // userId must exist
    if (!userValidationRepository.existsByUserId(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " does not exist.");
    }
    // User must not already be a member
    if (members.contains(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " is already a member of the group.");
    }

    apply(new GroupMemberAddedEvent(cmd.groupId(), cmd.userId()));
  }

  @CommandHandler
  public void handle(RemoveGroupMemberCommand cmd) {
    // User must be a member
    if (!members.contains(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " is not a member of this group.");
    }

    apply(new GroupMemberRemovedEvent(cmd.groupId(), cmd.userId()));
  }

  @CommandHandler
  public void handle(InviteUserCommand cmd,
      GroupValidationRepository groupValidationRepository,
      UserValidationRepository userValidationRepository) {
    // userId must exist
    if (!userValidationRepository.existsByUserId(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " does not exist.");
    }
    // User must not already be a member
    if (members.contains(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " is already a member of the group.");
    }
    // User must not already be invited
    if (invitedUsers.contains(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " has already been invited to the group.");
    }

    apply(new UserInvitedEvent(cmd.groupId(), cmd.userId()));
  }

  @CommandHandler
  public void handle(CancelInviteCommand cmd) {
    // User must have been invited
    if (!invitedUsers.contains(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " has not been invited to the group.");
    }

    apply(new UserInvitationCancelledEvent(cmd.groupId(), cmd.userId()));
  }

  
  @CommandHandler
  public void handle(JoinGroupCommand cmd, UserValidationRepository userValidationRepository) {
    // userId must exist
    if (!userValidationRepository.existsByUserId(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " does not exist.");
    }
    // User must have been invited
    if (!invitedUsers.contains(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " has not been invited to the group.");
    }
    // User must not already be a member
    if (members.contains(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " is already a member of the group.");
    }

    apply(new UserJoinedGroupEvent(cmd.groupId(), cmd.groupId()));
  }
  
  @CommandHandler
  public void handle(LeaveGroupCommand cmd, UserValidationRepository userValidationRepository) {
    // User must exist
    if (!userValidationRepository.existsByUserId(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " does not exist.");
    }
    // User must be a member
    if (!members.contains(cmd.userId())) {
      throw new DomainException("User with ID " + cmd.userId() + " is not a member of the group.");
    }

    apply(new UserLeftGroupEvent(cmd.groupId(), cmd.groupId()));
  }
  
  @EventSourcingHandler
  public void on(GroupCreatedEvent event) {
    this.groupId = event.groupId();
    this.ownerId = event.ownerId();
    this.name = event.name();
    this.description = event.description();
    this.members = new ArrayList<>();

  }

  @EventSourcingHandler
  public void on(GroupDetailsChangedEvent event) {
      this.name = event.name();
      this.description = event.description();
  }

  @EventSourcingHandler
  public void on(GroupMemberAddedEvent event) {
    this.members.add(event.userId());
  }

  @EventSourcingHandler
  public void on(GroupMemberRemovedEvent event) {
    this.members.remove(event.userId());
  }

  @EventSourcingHandler
  public void on(UserInvitedEvent event) {
    this.invitedUsers.add(event.userId());
  }

  @EventSourcingHandler
  public void on(UserInvitationCancelledEvent event) {
    this.invitedUsers.remove(event.userId());
  }

  @EventSourcingHandler
  public void on(UserJoinedGroupEvent event) {
    this.members.add(event.userId());
    this.invitedUsers.remove(event.userId());
  }

  @EventSourcingHandler
  public void on(UserLeftGroupEvent event) {
    this.members.remove(event.userId());
  }
}
