import {
  body,
  endpoint,
  pathParams,
  request,
  response,
  String,
} from "@airtasker/spot";

import {
  SuccessResponse,
  GetUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetAgentsResponse,
  GetEditorsResponse,
} from "../types";

@endpoint({ method: "GET", path: "/api/users" })
class GetUsers {
  @request
  request() {}

  @response({ status: 200 })
  successfulResponse(@body body: GetUsersResponse) {}
}

@endpoint({ method: "PUT", path: "/api/users/:id" })
class UpdateUser {
  @request
  request(
    @pathParams pathParams: { id: String },
    @body body: UpdateUserRequest
  ) {}

  @response({ status: 200 })
  successfulResponse(@body body: UpdateUserResponse) {}
}

@endpoint({ method: "DELETE", path: "/api/users/:id" })
class DeleteUser {
  @request
  request(@pathParams pathParams: { id: String }) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({ method: "GET", path: "/api/agents" })
class GetAgents {
  @request
  request() {}

  @response({ status: 200 })
  successfulResponse(@body body: GetAgentsResponse) {}
}

@endpoint({ method: "GET", path: "/api/editors" })
class GetEditors {
  @request
  request() {}

  @response({ status: 200 })
  successfulResponse(@body body: GetEditorsResponse) {}
}
