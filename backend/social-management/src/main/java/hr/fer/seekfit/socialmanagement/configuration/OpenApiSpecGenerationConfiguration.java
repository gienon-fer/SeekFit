package hr.fer.seekfit.socialmanagement.configuration;

import hr.fer.seekfit.socialmanagement.rest.controler.api.SocialManagementControllerApiDocks;
import hr.fer.seekfit.socialmanagement.rest.controler.impl.SocialManagementController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;

/**
 * This configuration is used by ApiDocs generator to run Spring Boot application without any
 * controller's downstream dependencies.
 */
@Slf4j
@Configuration
@Import({ApiDocsConfiguration.class})
@Profile({"openApiSpecGeneration", "test"})
@ComponentScan(basePackages = {"*.controller.*"})
public class OpenApiSpecGenerationConfiguration {

  @Bean
  public SocialManagementControllerApiDocks socialManagementController() {
    log.info("Build Social Management V1 controller for OpenAPI spec generation");
    return new SocialManagementController(null,null,null,null, null);
  }

}
