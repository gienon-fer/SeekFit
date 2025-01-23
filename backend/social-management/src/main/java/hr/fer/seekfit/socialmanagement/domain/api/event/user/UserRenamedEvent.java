package hr.fer.seekfit.socialmanagement.domain.api.event.user;

public record UserRenamedEvent(String userId, String newName) {}
