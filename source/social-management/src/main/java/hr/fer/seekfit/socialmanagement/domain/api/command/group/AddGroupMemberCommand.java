package hr.fer.seekfit.socialmanagement.domain.api.command.group;


public record AddGroupMemberCommand(String groupId, String userId) {}