import { body, endpoint, request, response } from "@airtasker/spot";

import {
  SuccessResponse,
  UserResponse,
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  ActivateAccountRequest,
  ResendActivationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types";

@endpoint({ method: "POST", path: "/auth/sign-up" })
class SignUp {
  @request
  request(@body body: SignUpRequest) {}

  @response({ status: 201 })
  successfulResponse(@body body: SignUpResponse) {}
}

@endpoint({ method: "POST", path: "/login" })
class Login {
  @request
  request(@body body: LoginRequest) {}

  @response({ status: 200 })
  successfulResponse(@body body: UserResponse) {}
}

@endpoint({ method: "GET", path: "/auth/logout" })
class Logout {
  @request
  request() {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({ method: "GET", path: "/auth/verify" })
class Verify {
  @request
  request() {}

  @response({ status: 200 })
  successfulResponse(@body body: UserResponse) {}
}

@endpoint({ method: "POST", path: "/auth/activation" })
class ActivateAccount {
  @request
  request(@body body: ActivateAccountRequest) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({ method: "POST", path: "/auth/resend-activation" })
class ResendActivation {
  @request
  request(@body body: ResendActivationRequest) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({ method: "POST", path: "/auth/forgot-password" })
class ForgotPassword {
  @request
  request(@body body: ForgotPasswordRequest) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}

@endpoint({ method: "POST", path: "/auth/reset-password" })
class ResetPassword {
  @request
  request(@body body: ResetPasswordRequest) {}

  @response({ status: 200 })
  successfulResponse(@body body: SuccessResponse) {}
}
