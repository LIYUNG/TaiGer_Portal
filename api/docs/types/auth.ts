import { String } from '@airtasker/spot'

import { SuccessResponse } from './common'

interface User {
  _id: String
  name: String
  email: String
  role: String
}

interface Guest extends User {
  role: 'Guest'
}

interface Admin extends User {
  role: 'Admin'
}

interface Agent extends User {
  role: 'Agent'
  students: User[]
}

interface Editor extends User {
  role: 'Editor'
  students: User[]
}

interface Student extends User {
  role: 'Student'
  agents: User[]
  editors: User[]
}

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
