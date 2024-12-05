package hr.fer.seekfit.socialmanagement.domain.api.command.friendship;

public record SendFriendRequestCommand(String friendshipId, String requesterId, String recipientId) {}
