package hr.fer.seekfit.socialmanagement.rest.dto.friendship;

import java.util.List;
import lombok.Data;

@Data
public class UserFriendsListDto {
  private String userId;
  private List<FriendshipSummaryDto> friends;
}