package hr.fer.seekfit.socialmanagement.domain.model;

import hr.fer.seekfit.socialmanagement.domain.api.command.user.RegisterUserCommand;
import hr.fer.seekfit.socialmanagement.domain.api.command.user.RenameUserCommand;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.axonframework.commandhandling.CommandHandler;
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
public class User {

  @AggregateIdentifier
  private String userId;
  private String name;

  @CommandHandler
  public User(RegisterUserCommand cmd) {
    throw new UnsupportedOperationException();
  }

  @CommandHandler
  public void handle(RenameUserCommand cmd) {
    throw new UnsupportedOperationException();
  }


}
