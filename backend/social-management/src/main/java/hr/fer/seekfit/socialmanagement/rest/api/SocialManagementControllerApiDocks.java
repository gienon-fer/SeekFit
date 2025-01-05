package hr.fer.seekfit.socialmanagement.rest.api;

import static hr.fer.seekfit.socialmanagement.rest.Constants.ACCEPTED;
import static hr.fer.seekfit.socialmanagement.rest.Constants.BAD_REQUEST;
import static hr.fer.seekfit.socialmanagement.rest.Constants.SERVER_ERROR;
import static hr.fer.seekfit.socialmanagement.rest.Constants.SERVER_ERROR_MESSAGE;

import hr.fer.seekfit.socialmanagement.rest.dto.ErrorDto;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.AcceptFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.FriendshipIdDto;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.IgnoreFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.RemoveFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.friendship.SendFriendRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.AddGroupMemberRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.ChangeGroupDetailsRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.CreateGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.GroupIdDto;
import hr.fer.seekfit.socialmanagement.rest.dto.group.JoinGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.LeaveGroupRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.group.RemoveGroupMemberRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RegisterUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.RenameUserRequest;
import hr.fer.seekfit.socialmanagement.rest.dto.user.UserIdDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Social Management API", description = "API for managing social interactions")
public interface SocialManagementControllerApiDocks {

    String TAG = "Social Management V1";

    /**
     * Register a new user.
     */
    @Operation(summary = "Register a new user", tags = TAG, description = "Allows creating a new user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "User registered."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid user data.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    UserIdDto registerUser(
        @RequestBody(description = "DTO for registration of the user.", required = true)
        RegisterUserRequest registerUserRequest);

    /**
     * Rename an existing user.
     */
    @Operation(summary = "Rename user", tags = TAG, description = "Allows renaming an existing user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "User renamed."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid rename request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    UserIdDto renameUser(
        @RequestBody(description = "DTO for renaming a user.", required = true)
        RenameUserRequest renameUserRequest);

    /* ----------------- Group Endpoints ----------------- */
    @Operation(summary = "Create a new group", tags = TAG, description = "Allows creating a new group.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Group created."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid group data.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    GroupIdDto createGroup(
        @RequestBody(description = "DTO for creating a group.", required = true)
        CreateGroupRequest createGroupRequest);

    @Operation(summary = "Change group details", tags = TAG, description = "Allows changing group name or description.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Group details changed."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid change request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    GroupIdDto changeGroupDetails(
        @RequestBody(description = "DTO for changing group details.", required = true)
        ChangeGroupDetailsRequest changeRequest);

    @Operation(summary = "Add a member to a group", tags = TAG)
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Member added."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    GroupIdDto addGroupMember(
        @RequestBody(description = "DTO for adding a member to the group.", required = true)
        AddGroupMemberRequest request);

    @Operation(summary = "Remove a member from a group", tags = TAG)
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Member removed."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    GroupIdDto removeGroupMember(
        @RequestBody(description = "DTO for removing a member from the group.", required = true)
        RemoveGroupMemberRequest request);

    @Operation(summary = "Join a group", tags = TAG, description = "Allows a user to join a group via invitation link.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Group joined."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    GroupIdDto joinGroup(
        @RequestBody(description = "DTO for joining a group.", required = true)
        JoinGroupRequest request);

    @Operation(summary = "Leave a group", tags = TAG, description = "Allows a user to leave a group.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Group left."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    GroupIdDto leaveGroup(
        @RequestBody(description = "DTO for leaving a group.", required = true)
        LeaveGroupRequest request);

    /* -------------- Friendship Endpoints -------------- */
    @Operation(summary = "Send a friend request", tags = TAG, description = "Allows sending a friend request.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Friend request sent."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    FriendshipIdDto sendFriendRequest(
        @RequestBody(description = "DTO for sending a friend request.", required = true)
        SendFriendRequest request);

    @Operation(summary = "Accept a friend request", tags = TAG, description = "Allows accepting a pending friend request.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Friend request accepted."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    FriendshipIdDto acceptFriendRequest(
        @RequestBody(description = "DTO for accepting a friend request.", required = true)
        AcceptFriendRequest request);

    @Operation(summary = "Ignore a friend request", tags = TAG, description = "Allows ignoring a pending friend request.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Friend request ignored."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    FriendshipIdDto ignoreFriendRequest(
        @RequestBody(description = "DTO for ignoring a friend request.", required = true)
        IgnoreFriendRequest request);

    @Operation(summary = "Remove friend", tags = TAG, description = "Allows removing an existing friend connection.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = ACCEPTED, description = "Friend removed."),
        @ApiResponse(responseCode = BAD_REQUEST, description = "Invalid request.",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class))),
        @ApiResponse(responseCode = SERVER_ERROR, description = SERVER_ERROR_MESSAGE,
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDto.class)))})
    FriendshipIdDto removeFriend(
        @RequestBody(description = "DTO for removing a friend.", required = true)
        RemoveFriendRequest request);

}