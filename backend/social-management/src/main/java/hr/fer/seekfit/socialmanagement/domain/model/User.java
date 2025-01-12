package hr.fer.seekfit.socialmanagement.domain.model;

import hr.fer.seekfit.socialmanagement.domain.api.command.user.RegisterUserCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.user.RenameUserCommand;
import hr.fer.seekfit.socialmanagement.domain.api.event.user.UserRegisteredEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.user.UserRenamedEvent;
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

import static org.axonframework.modelling.command.AggregateLifecycle.apply;

@Aggregate
@Revision("1.0")
@Builder
@EqualsAndHashCode(callSuper = false)
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class User {

  @AggregateIdentifier
  private String userId;
  private String name;

  @CommandHandler
  public User(RegisterUserCommand cmd, UserValidationRepository userValidationRepository) {
    // Invariant: name must be unique across domain
    if (userValidationRepository.existsByName(cmd.name())) {
      throw new DomainException("Username '" + cmd.name() + "' is already taken.");
    }

    apply(new UserRegisteredEvent(cmd.userId(), cmd.name()));
  }

  @CommandHandler
  public void handle(RenameUserCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @EventSourcingHandler
  public void on(UserRegisteredEvent event) {
    this.userId = event.userId();
    this.name = event.name();
  }

  @EventSourcingHandler
  public void on(UserRenamedEvent event) {
    this.name = event.newName();
  }

}
