import { String } from '@airtasker/spot'

import { SuccessResponse } from './common'

export interface SignUpRequest {
  name: String
  email: String
  password: String
}

export interface SignUpResponse extends SuccessResponse {
  data: {
    name: String
    email: String
  }
}

export interface LoginRequest {
  email: String
  password: String
}

export interface LoginResponse extends SuccessResponse {
  data: {
    name: String
    email: String
    role: 'Admin' | 'Guest' | 'Agent' | 'Editor' | 'Student'
  }
}
