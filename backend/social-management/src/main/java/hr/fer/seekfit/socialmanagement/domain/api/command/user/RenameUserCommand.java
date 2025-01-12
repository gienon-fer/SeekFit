package hr.fer.seekfit.socialmanagement.domain.api.command.user;

import lombok.Builder;

@Builder
public record RenameUserCommand(String userId, String newName) {}