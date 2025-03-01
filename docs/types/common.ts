import { String } from '@airtasker/spot'

export type SuccessResponse = {
  success: true
}

export type FailedResponse = {
  success: false
  message?: String
}
