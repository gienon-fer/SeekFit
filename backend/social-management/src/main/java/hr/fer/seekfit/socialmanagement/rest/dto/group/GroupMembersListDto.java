package hr.fer.seekfit.socialmanagement.rest.dto.group;

import java.util.List;
import lombok.Data;

@Data
public class GroupMembersListDto {
  private String groupId;
  private List<GroupMemberResponseDto> members;
}