import { String, Date } from '@airtasker/spot'

import { SuccessResponse } from './common'

export type Program = {
  school: String
  name: String
  url: String
  degree: 'bachelor' | 'master' | 'doctoral'
  semester: String
  applicationAvailable?: Date
  application_deadline: Date
  requiredDocuments: String[]
  optionalDocuments: String[]
  createdAt: Date
  updatedAt: Date
}

export interface GetProgramsResponse extends SuccessResponse {
  data: Program[]
}

export interface GetProgramResponse extends SuccessResponse {
  data: Program
}

export interface CreateProgramRequest {
  school: String
  name: String
  url?: String
  degree: 'bachelor' | 'master' | 'doctoral'
  semester: String
  applicationAvailable?: Date
  application_deadline: Date
  requiredDocuments: String[]
  optionalDocuments?: String[]
}

export interface CreateProgramResponse extends SuccessResponse {
  data: Program
}

export interface UpdateProgramRequest {
  school?: String
  name?: String
  url?: String
  degree?: 'bachelor' | 'master' | 'doctoral'
  semester?: String
  applicationAvailable?: Date
  application_deadline?: Date
  requiredDocuments?: String[]
  optionalDocuments?: String[]
}

export interface UpdateProgramResponse extends SuccessResponse {
  data: Program
}
