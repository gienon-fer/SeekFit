package hr.fer.seekfit.socialmanagement.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import io.swagger.v3.oas.models.info.Info;
import java.io.IOException;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
@ComponentScan(basePackages = "*.controller.*")
public class ApiDocsConfiguration {
  public static final String DEFINITIONS_PATH = "api-docs-definitions/%s.yaml";
  public static final String ACTUATOR_GROUP = "social_management_actuator";
  public static final String ACTUATOR_PATH = "/actuator/**";

  public static final String SOCIAL_MANAGEMENT_GROUP = "social-management";
  public static final String SOCIAL_MANAGEMENT_V2_PATH = "/api/v1/**";

  public static final ObjectMapper YAML_OBJECT_MAPPER = new ObjectMapper(new YAMLFactory());

  @Bean
  public GroupedOpenApi actuatorGroupApiDefinition() throws IOException {
    Info info = YAML_OBJECT_MAPPER.readValue(
        new ClassPathResource(String.format(DEFINITIONS_PATH, ACTUATOR_GROUP)).getInputStream(),
        Info.class);
    return GroupedOpenApi.builder()
        .group(ACTUATOR_GROUP)
        .pathsToMatch(ACTUATOR_PATH)
        .addOpenApiCustomiser(openApi -> openApi.info(info))
        .build();
  }

  @Bean
  public GroupedOpenApi socialManagementV2GroupApiDefinition() throws IOException {
    Info info = YAML_OBJECT_MAPPER.readValue(
        new ClassPathResource(String.format(DEFINITIONS_PATH, SOCIAL_MANAGEMENT_GROUP)).getInputStream(),
        Info.class);
    return GroupedOpenApi.builder()
        .group(SOCIAL_MANAGEMENT_GROUP)
        .pathsToMatch(SOCIAL_MANAGEMENT_V2_PATH)
        .addOpenApiCustomiser(openApi -> openApi.info(info))
        .build();
  }
}
