package hr.fer.seekfit.socialmanagement.domain.api.command.friendship;

import lombok.Builder;

@Builder
public record SendFriendRequestCommand(String friendshipId, String requesterId, String recipientId) {}
