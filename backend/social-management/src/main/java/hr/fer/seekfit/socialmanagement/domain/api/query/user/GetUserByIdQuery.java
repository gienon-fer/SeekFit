package hr.fer.seekfit.socialmanagement.domain.api.query.user;

import lombok.Builder;

@Builder
public record GetUserByIdQuery(String userId) {
}