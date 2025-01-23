package hr.fer.seekfit.socialmanagement.domain.api.command.group;

import lombok.Builder;

@Builder
public record RemoveGroupMemberCommand(String groupId, String userId) {}
