package hr.fer.seekfit.socialmanagement.configuration;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;

/**
 * This is the main application configuration.
 */
@Profile("!openApiSpecGeneration")
@Configuration
@ComponentScan(basePackages = {"hr.fer.seekfit"})
@Import({ApiDocsConfiguration.class})
public class SocialManagementApplicationConfiguration {

}
