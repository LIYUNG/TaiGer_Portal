import { String } from '@airtasker/spot'

import { SuccessResponse } from './common';

export interface User {
  _id: String
  name: String
  email: String
  role: String
}

export interface Guest extends User {
  role: 'Guest'
}

export interface Admin extends User {
  role: 'Admin'
}

export interface Agent extends User {
  role: 'Agent'
  students: User[]
}

export interface Editor extends User {
  role: 'Editor'
  students: User[]
}

export interface Student extends User {
  role: 'Student'
  agents: User[]
  editors: User[]
}

export interface GetUsersResponse extends SuccessResponse {
  data: User[]
}

export interface UpdateUserRequest {
  email?: String
  name?: String
  role?: 'Guest' | 'Admin' | 'Agent' | 'Editor' | 'Student'
}

export interface UpdateUserResponse extends SuccessResponse {
  data: User
}

export interface GetAgentsResponse extends SuccessResponse {
  data: Agent[]
}

export interface GetEditorsResponse extends SuccessResponse {
  data: Editor[]
}
