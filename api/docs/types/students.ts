import { String, Date } from "@airtasker/spot";

import { SuccessResponse } from "./common";
import { Student } from "./user";

type DocumentStatus = String;

interface Document {
  name: String;
  status: DocumentStatus;
  required: boolean;
  path: String;
  updatedAt: Date;
}

interface Application {
  programId: String;
  documents: Document[];
}

export interface GetStudentsResponse extends SuccessResponse {
  data: Student[];
}

export interface GetStudentResponse extends SuccessResponse {
  data: Student;
}

export interface AssignAgentToStudentRequest {
  id: String;
}

export interface AssignEditorToStudentRequest {
  id: String;
}

export interface CreateApplicationRequest {
  programId: String;
}

export interface CreateApplicationResponse extends SuccessResponse {
  data: Application;
}

export interface UploadDocumentResponse extends SuccessResponse {
  data: Document;
}

export interface UpdateDocumentStatusRequest {
  status: DocumentStatus;
}

export interface UpdateDocumentStatusResponse extends SuccessResponse {
  data: Document;
}
