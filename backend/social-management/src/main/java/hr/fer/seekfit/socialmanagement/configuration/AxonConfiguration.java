package hr.fer.seekfit.socialmanagement.configuration;

import lombok.extern.slf4j.Slf4j;
import org.axonframework.eventsourcing.EventCountSnapshotTriggerDefinition;
import org.axonframework.eventsourcing.SnapshotTriggerDefinition;
import org.axonframework.eventsourcing.Snapshotter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Slf4j
@Configuration
@EnableJpaRepositories(basePackages = "hr.fer.seekfit")
public class AxonConfiguration {

  private static final int SNAPSHOTTER_THRESHOLD = 10;

  @Bean
  public SnapshotTriggerDefinition tenantManagementSnapshotTrigger(Snapshotter snapshotter) {
    return new EventCountSnapshotTriggerDefinition(snapshotter, SNAPSHOTTER_THRESHOLD);
  }

}
