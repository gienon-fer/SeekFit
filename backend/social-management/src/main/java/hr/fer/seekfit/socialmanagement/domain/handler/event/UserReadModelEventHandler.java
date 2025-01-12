package hr.fer.seekfit.socialmanagement.domain.handler.event;

import static hr.fer.seekfit.socialmanagement.configuration.Constants.READ_MODEL_EVENT_PROCESSOR;

import hr.fer.seekfit.socialmanagement.domain.api.event.user.UserRegisteredEvent;
import hr.fer.seekfit.socialmanagement.domain.api.event.user.UserRenamedEvent;
import hr.fer.seekfit.socialmanagement.domain.projection.entity.UserReadModel;
import hr.fer.seekfit.socialmanagement.domain.projection.repository.UserProjectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.axonframework.config.ProcessingGroup;
import org.axonframework.eventhandling.EventHandler;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
@ProcessingGroup(READ_MODEL_EVENT_PROCESSOR)
public class UserReadModelEventHandler {

  private final UserProjectionRepository userProjectionRepository;

  @EventHandler
  public void on(UserRegisteredEvent event) {
    log.info("Handling UserRegisteredEvent for userId={}", event.userId());
    var user = new UserReadModel();
    user.setUserId(event.userId());
    user.setName(event.name());
    userProjectionRepository.save(user);
  }

  @EventHandler
  public void on(UserRenamedEvent event) {
    log.info("Handling UserRenamedEvent for userId={}", event.userId());
    var user = userProjectionRepository.findById(event.userId())
        .orElseThrow(() -> new RuntimeException("User not found"));
    user.setName(event.newName());
    userProjectionRepository.save(user);
  }
}
