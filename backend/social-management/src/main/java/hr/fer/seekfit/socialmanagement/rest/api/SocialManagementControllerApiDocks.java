package hr.fer.seekfit.socialmanagement.rest.api;


import static hr.fer.seekfit.socialmanagement.rest.Constants.ACCEPTED;
import static hr.fer.seekfit.socialmanagement.rest.Constants.BAD_REQUEST;
import static hr.fer.seekfit.socialmanagement.rest.Constants.SERVER_ERROR;
import static hr.fer.seekfit.socialmanagement.rest.Constants.SERVER_ERROR_MESSAGE;

import hr.fer.seekfit.socialmanagement.rest.dto.ErrorDto;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RegisterUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.UserIdDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;

@Tag(name = "Social Management API", description = "API for managing social interactions")
public interface SocialManagementControllerApiDocks {

    String TAG = "Social Management V1";

    /**
     * Register a new user.
     *
     * @param registerUserRequest The request for user registration.
     */
    @Operation(summary = "Register a new user", tags = TAG,
        description = "This endpoint allows creating a new user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "User registered."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid user supplied.", content = {
            @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorDto.class))}),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE, content = {
            @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorDto.class))})})
    UserIdDto registerUser(
        @RequestBody(description = "DTO instance for registration of the user.", required = true)
        RegisterUserRequest registerUserRequest);
}