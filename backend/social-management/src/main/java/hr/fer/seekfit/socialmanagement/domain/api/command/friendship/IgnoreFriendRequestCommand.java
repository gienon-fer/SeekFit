package hr.fer.seekfit.socialmanagement.domain.api.command.friendship;

import lombok.Builder;

@Builder
public record IgnoreFriendRequestCommand(String friendshipId) {}