package hr.fer.seekfit.socialmanagement.domain.handler.event;

import static hr.fer.seekfit.socialmanagement.configuration.Constants.READ_MODEL_EVENT_PROCESSOR;

import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupCreatedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupDetailsChangedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupMemberAddedEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.group.GroupMemberRemovedEvent;
import hr.fer.seekfit.socialmanagement.domain.projection.entity.GroupMemberReadModel;
import hr.fer.seekfit.socialmanagement.domain.projection.entity.GroupReadModel;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.GroupMemberProjectionRepository;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.GroupProjectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.config.ProcessingGroup;
import org.axonframework.eventhandling.EventHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ProcessingGroup(READ_MODEL_EVENT_PROCESSOR)
@Slf4j
public class GroupReadModelEventHandler {

  private final GroupProjectionRepository groupProjectionRepository;
  private final GroupMemberProjectionRepository groupMemberProjectionRepository;

  @EventHandler
  public void on(GroupCreatedEvent event) {
    log.info("Handling GroupCreatedEvent for groupId={}", event.groupId());
    var group = new GroupReadModel();
    group.setGroupId(event.groupId());
    group.setOwnerId(event.ownerId());
    group.setName(event.name());
    group.setDescription(event.description());
    groupProjectionRepository.save(group);
  }

  @EventHandler
  public void on(GroupDetailsChangedEvent event) {
    log.info("Handling GroupDetailsChangedEvent for groupId={}", event.groupId());
    var group = groupProjectionRepository.findById(event.groupId())
        .orElseThrow(() -> new RuntimeException("Group not found"));
    group.setName(event.name());
    group.setDescription(event.description());
    groupProjectionRepository.save(group);
  }

  @EventHandler
  public void on(GroupMemberAddedEvent event) {
    log.info("Handling GroupMemberAddedEvent for groupId={}, userId={}",
        event.groupId(), event.userId());

    var groupMember = new GroupMemberReadModel();
    groupMember.setGroupId(event.groupId());
    groupMember.setUserId(event.userId());
    groupMember.setJoinedAt(java.time.LocalDateTime.now());
    groupMemberProjectionRepository.save(groupMember);
  }

  @EventHandler
  public void on(GroupMemberRemovedEvent event) {
    log.info("Handling GroupMemberRemovedEvent for groupId={}, userId={}",
        event.groupId(), event.userId());

    var groupMembers = groupMemberProjectionRepository.findByGroupId(event.groupId());
    var toRemove = groupMembers.stream()
        .filter(gm -> gm.getUserId().equals(event.userId()))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("GroupMember not found"));
    groupMemberProjectionRepository.delete(toRemove);
  }

  //TODO Similarly handle: UserJoinedGroupEvent, UserLeftGroupEvent, etc.
}
