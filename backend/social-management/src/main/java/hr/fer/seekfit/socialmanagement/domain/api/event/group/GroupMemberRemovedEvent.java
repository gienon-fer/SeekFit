package hr.fer.seekfit.socialmanagement.domain.api.event.group;

public record GroupMemberRemovedEvent(String groupId, String userId) {}
