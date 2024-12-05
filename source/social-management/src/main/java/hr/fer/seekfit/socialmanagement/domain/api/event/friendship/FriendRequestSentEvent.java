package hr.fer.seekfit.socialmanagement.domain.api.event.friendship;

public record FriendRequestSentEvent(String friendshipId, String requesterId, String recipientId) {}