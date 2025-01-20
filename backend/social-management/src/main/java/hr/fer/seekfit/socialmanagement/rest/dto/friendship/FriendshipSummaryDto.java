package hr.fer.seekfit.socialmanagement.rest.dto.friendship;

import lombok.Data;

/**
 * Basic friend info, you can expand as needed
 */
@Data
public class FriendshipSummaryDto { //TODO rename
  //TODO add friendship id
  private String friendId;
  private String friendName;
}
