package hr.fer.seekfit.socialmanagement.domain.api.command.user;

public record RenameUserCommand(String userId, String newName) {}