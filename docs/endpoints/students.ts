import {
  body,
  endpoint,
  headers,
  pathParams,
  request,
  response,
  String,
} from "@airtasker/spot";

import {
  SuccessResponse,
  GetStudentsResponse,
  GetStudentResponse,
  AssignAgentToStudentRequest,
  AssignEditorToStudentRequest,
  CreateApplicationRequest,
  CreateApplicationResponse,
  UploadDocumentResponse,
  UpdateDocumentStatusRequest,
  UpdateDocumentStatusResponse,
} from "../types";

@endpoint({ method: "GET", path: "/api/students" })
class GetStudents {
  @request
  request() {}

  @response({ status: 200 })
  successfulResponse(@body body: GetStudentsResponse) {}
}

@endpoint({ method: "GET", path: "/api/student/:id" })
class GetStudent {
  @request
  request(@pathParams pathParams: { id: String }) {}

  @response({ status: 200 })
  successfulResponse(@body body: GetStudentResponse) {}
}

@endpoint({ method: "POST", path: "/api/students/:id/agents" })
class AssignAgentToStudent {
  @request
  request(
    @pathParams pathParams: { id: String },
    @body body: AssignAgentToStudentRequest
  ) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({ method: "POST", path: "/api/students/:id/editors" })
class AssignEditorToStudent {
  @request
  request(
    @pathParams pathParams: { id: String },
    @body body: AssignEditorToStudentRequest
  ) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({
  method: "DELETE",
  path: "/api/students/:studentId/editors/:editorId",
})
class RemoveEditorFromStudent {
  @request
  request(@pathParams pathParams: { studentId: String; editorId: String }) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({ method: "POST", path: "/api/students/:id/applications" })
class CreateApplication {
  @request
  request(
    @pathParams pathParams: { id: String },
    @body body: CreateApplicationRequest
  ) {}

  @response({ status: 201 })
  successfulResponse(@body body: CreateApplicationResponse) {}
}

@endpoint({
  method: "DELETE",
  path: "/api/students/:studentId/applications/:applicationId",
})
class DeleteApplication {
  @request
  request(
    @pathParams pathParams: { studentId: String; applicationId: String }
  ) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({
  method: "GET",
  path: "/api/students/:studentId/applications/:applicationId/:docName",
})
class DownloadDocument {
  @request
  request(
    @pathParams
    pathParams: {
      studentId: String;
      applicationId: String;
      docName: String;
    }
  ) {}

  @response({ status: 200 })
  successfulResponse(
    @headers
    headers: { "Content-disposition": "attachment: filename=filename.pdf" },
    @body body: SuccessResponse
  ) {}
}

@endpoint({
  method: "POST",
  path: "/api/students/:studentId/applications/:applicationId/:docName",
})
class UploadDocument {
  @request
  request(
    @pathParams
    pathParams: { studentId: String; applicationId: String; docName: String },
    @headers headers: { "Content-type": "multipart/form-data" }
  ) {}

  @response({ status: 201 })
  successfulResponse(@body body: UploadDocumentResponse) {}
}

@endpoint({
  method: "DELETE",
  path: "/api/students/:studentId/applications/:applicationId/:docName",
})
class DeleteDocument {
  @request
  request(
    @pathParams
    pathParams: {
      studentId: String;
      applicationId: String;
      docName: String;
    }
  ) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({
  method: "POST",
  path: "/api/students/:studentId/applications/:applicationId/:docName/status",
})
class UpdateDocumentStatus {
  @request
  request(
    @pathParams
    pathParams: { studentId: String; applicationId: String; docName: String },
    @body body: UpdateDocumentStatusRequest
  ) {}

  @response({ status: 200 })
  successfulResponse(@body body: UpdateDocumentStatusResponse) {}
}
