package hr.fer.seekfit.socialmanagement.configuration;

import hr.fer.seekfit.socialmanagement.rest.api.SocialManagementControllerApiDocks;
import hr.fer.seekfit.socialmanagement.rest.impl.SocialManagementController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * This configuration is used by ApiDocs generator to run Spring Boot application without any
 * controller's downstream dependencies.
 */
@Slf4j
@Configuration
@Import({ApiDocsConfiguration.class})
public class OpenApiSpecGenerationConfiguration {

  @Bean
  public SocialManagementControllerApiDocks principalV2Controller() {
    log.info("Build Social Management V2 controller for OpenAPI spec generation");
    return new SocialManagementController(null, null);
  }

}
