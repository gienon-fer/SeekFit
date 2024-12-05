package hr.fer.seekfit.socialmanagement.domain.api.event.group;

public record GroupCreatedEvent(String groupId, String ownerId, String name, String description) {}
