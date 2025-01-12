package hr.fer.seekfit.socialmanagement.domain.api.query.group;

import lombok.Builder;

@Builder
public record GetGroupByIdQuery(String groupId) {
}
