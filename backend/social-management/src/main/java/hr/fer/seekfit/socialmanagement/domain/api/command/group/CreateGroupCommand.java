package hr.fer.seekfit.socialmanagement.domain.api.command.group;

public record CreateGroupCommand(String groupId, String ownerId, String name, String description) {}