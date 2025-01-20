package hr.fer.seekfit.socialmanagement.rest.dto.user;

import hr.fer.seekfit.socialmanagement.rest.dto.AggregateIdDto;
import lombok.experimental.SuperBuilder;

@SuperBuilder
public class UserIdDto extends AggregateIdDto {

  public UserIdDto(String id) {
    super(id);
  }
}
