package hr.fer.seekfit.socialmanagement.domain.api.command.group;

import lombok.Builder;

@Builder
public record LeaveGroupCommand(String groupId, String userId) {}