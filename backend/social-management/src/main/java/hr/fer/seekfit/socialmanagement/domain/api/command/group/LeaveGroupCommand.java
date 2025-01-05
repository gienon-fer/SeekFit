package hr.fer.seekfit.socialmanagement.domain.api.command.group;

public record LeaveGroupCommand(String groupId, String userId) {}