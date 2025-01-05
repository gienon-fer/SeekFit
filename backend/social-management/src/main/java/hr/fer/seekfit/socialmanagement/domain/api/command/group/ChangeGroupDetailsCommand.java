package hr.fer.seekfit.socialmanagement.domain.api.command.group;

//TODO Make more granular
public record ChangeGroupDetailsCommand(String groupId, String name, String description) {}