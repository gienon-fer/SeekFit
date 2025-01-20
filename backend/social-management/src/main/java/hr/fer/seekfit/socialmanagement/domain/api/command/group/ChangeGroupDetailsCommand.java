package hr.fer.seekfit.socialmanagement.domain.api.command.group;

import lombok.Builder;

@Builder
public record ChangeGroupDetailsCommand(String groupId, String name, String description) {}