import { body, endpoint, request, response } from "@airtasker/spot";

import {
  SuccessResponse,
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
} from "../types";

@endpoint({ method: "POST", path: "/auth/signup" })
class SignUp {
  @request
  request(@body body: SignUpRequest) {}

  @response({ status: 201 })
  successfulResponse(@body body: SignUpResponse) {}
}

@endpoint({ method: "POST", path: "/auth/login" })
class Login {
  @request
  request(@body body: LoginRequest) {}

  @response({ status: 200 })
  successfulResponse(@body body: LoginResponse) {}
}

@endpoint({ method: "GET", path: "/auth/logout" })
class Logout {
  @request
  request() {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}
