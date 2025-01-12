package hr.fer.seekfit.socialmanagement.rest.dto.group;

import hr.fer.seekfit.socialmanagement.rest.dto.AggregateIdDto;
import lombok.experimental.SuperBuilder;

/**
 * DTO for returning a group's identifier.
 */
@SuperBuilder
public class GroupIdDto extends AggregateIdDto {
  public GroupIdDto(String id) {
    super(id);
  }
}
