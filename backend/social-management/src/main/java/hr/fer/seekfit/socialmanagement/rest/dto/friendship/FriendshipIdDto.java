package hr.fer.seekfit.socialmanagement.rest.dto.friendship;

import hr.fer.seekfit.socialmanagement.rest.dto.AggregateIdDto;
import lombok.experimental.SuperBuilder;

/**
 * DTO for returning a friendship's identifier.
 */
@SuperBuilder
public class FriendshipIdDto extends AggregateIdDto {
  public FriendshipIdDto(String id) {
    super(id);
  }
}
