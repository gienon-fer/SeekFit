package hr.fer.seekfit.socialmanagement;

import hr.fer.seekfit.socialmanagement.configuration.OpenApiSpecGenerationConfiguration;
import hr.fer.seekfit.socialmanagement.rest.controler.impl.SocialManagementController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EnableAutoConfiguration
@Import({OpenApiSpecGenerationConfiguration.class, SocialManagementController.class})
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}