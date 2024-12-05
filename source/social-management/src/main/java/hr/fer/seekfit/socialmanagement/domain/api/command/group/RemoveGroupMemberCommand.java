package hr.fer.seekfit.socialmanagement.domain.api.command.group;

public record RemoveGroupMemberCommand(String groupId, String userId) {}
