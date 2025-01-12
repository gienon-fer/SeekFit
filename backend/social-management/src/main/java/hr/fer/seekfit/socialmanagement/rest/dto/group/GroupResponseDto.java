package hr.fer.seekfit.socialmanagement.rest.dto.group;

import lombok.Data;

@Data
public class GroupResponseDto {
  private String groupId;
  private String ownerId;
  private String name;
  private String description;
}
