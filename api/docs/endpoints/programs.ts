import {
  body,
  endpoint,
  pathParams,
  request,
  response,
  String,
} from "@airtasker/spot";

import {
  GetProgramsResponse,
  GetProgramResponse,
  SuccessResponse,
  CreateProgramRequest,
  CreateProgramResponse,
  UpdateProgramRequest,
  UpdateProgramResponse,
} from "../types";

@endpoint({ method: "GET", path: "/api/programs" })
class GetPrograms {
  @request
  request() {}

  @response({ status: 200 })
  successfulResponse(@body body: GetProgramsResponse) {}
}

@endpoint({ method: "POST", path: "/api/programs" })
class CreateProgram {
  @request
  request(@body body: CreateProgramRequest) {}

  @response({ status: 200 })
  successfulResponse(@body body: CreateProgramResponse) {}
}

@endpoint({ method: "GET", path: "/api/programs/:id" })
class GetProgram {
  @request
  request(@pathParams pathParams: { id: String }) {}

  @response({ status: 200 })
  successfulResponse(@body body: GetProgramResponse) {}
}

@endpoint({ method: "PUT", path: "/api/programs/:id" })
class UpdateProgram {
  @request
  request(
    @pathParams pathParams: { id: String },
    @body body: UpdateProgramRequest
  ) {}

  @response({ status: 200 })
  successfulResponse(@body body: UpdateProgramResponse) {}
}

@endpoint({ method: "DELETE", path: "/api/programs/:id" })
class DeleteProgram {
  @request
  request(@pathParams pathParams: { id: String }) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}
