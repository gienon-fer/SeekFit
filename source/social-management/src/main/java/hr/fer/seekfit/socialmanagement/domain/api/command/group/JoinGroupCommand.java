package hr.fer.seekfit.socialmanagement.domain.api.command.group;

public record JoinGroupCommand(String groupId, String linkId, String userId) {}
