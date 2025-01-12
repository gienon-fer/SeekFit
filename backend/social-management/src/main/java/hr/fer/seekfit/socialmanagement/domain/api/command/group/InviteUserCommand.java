package hr.fer.seekfit.socialmanagement.domain.api.command.group;

import lombok.Builder;

@Builder
public record InviteUserCommand(String groupId, String userId) {}