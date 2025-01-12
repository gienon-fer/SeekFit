package hr.fer.seekfit.socialmanagement.domain.api.command.group;

import lombok.Builder;

@Builder
public record CreateGroupCommand(String groupId, String ownerId, String name, String description) {}