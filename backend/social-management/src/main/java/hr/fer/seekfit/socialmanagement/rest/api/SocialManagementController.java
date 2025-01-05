package hr.fer.seekfit.socialmanagement.rest.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = "Social Management API", description = "API for managing social interactions")
@RequestMapping("/api/social")
public interface SocialManagementController {

    @Operation(summary = "Get welcome message")
    @GetMapping("/welcome")
    ResponseEntity<String> getWelcomeMessage();
}