package hr.fer.seekfit.socialmanagement.domain.api.command.user;

import lombok.Builder;

@Builder
public record RegisterUserCommand(String userId, String name) {}