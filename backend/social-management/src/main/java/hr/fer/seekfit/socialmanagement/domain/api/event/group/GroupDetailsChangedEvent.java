package hr.fer.seekfit.socialmanagement.domain.api.event.group;

public record GroupDetailsChangedEvent(String groupId, String name, String description) {}
