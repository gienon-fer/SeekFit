package hr.fer.seekfit.socialmanagement.domain.api.command.group;

import lombok.Builder;

@Builder
public record JoinGroupCommand(String groupId, String linkId, String userId) {}
