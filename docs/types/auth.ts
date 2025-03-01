import { String } from '@airtasker/spot'

import { SuccessResponse } from './common'
import { Guest, Student, Agent, Editor, Admin } from './users'

export interface UserResponse extends SuccessResponse {
  data: Guest | Student | Agent | Editor | Admin
}

export interface SignUpRequest {
  name: String
  email: String
  password: String
}

export interface SignUpResponse extends SuccessResponse {
  data: Guest
}

export interface LoginRequest {
  email: String
  password: String
}

export interface ActivateAccountRequest {
  email: String
  token: String
}

export interface ResendActivationRequest {
  email: String
}

export interface ForgotPasswordRequest {
  email: String
}

export interface ResetPasswordRequest {
  email: String
  password: String
  token: String
}
