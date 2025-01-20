package hr.fer.seekfit.socialmanagement.rest.dto.group;

import lombok.Data;

@Data
public class GroupMemberResponseDto {
  private String userId;
  private String userName;
  private String joinedAt; //TODO Update
}
