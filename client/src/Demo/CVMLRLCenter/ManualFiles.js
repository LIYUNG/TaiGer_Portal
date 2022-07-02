import React from "react";
import ManualFilesList from "./ManualFilesList";
import ToggleableUploadFileForm from "./ToggleableUploadFileForm";
import { Row, Col, Tabs, Tab, Table } from "react-bootstrap";

class ManualFiles extends React.Component {
  state = {
    category: "",
  };

  handleProgramSpecificFormSubmit = (
    e,
    studentId,
    applicationId,
    fileCategory
  ) => {
    e.preventDefault();
    // console.log(e.target.files);
    if (!this.state.category) {
      alert("Please select file type");
    } else {
      this.props.SubmitProgramSpecificFile(
        e,
        studentId,
        applicationId,
        fileCategory
      );
      this.setState({ category: "" });
    }
  };
  handleGeneralDocSubmit = (e, studentId, fileCategory) => {
    e.preventDefault();
    // console.log(e.target.files);
    if (!this.state.category) {
      alert("Please select file type");
    } else {
      this.props.SubmitGeneralFile(e, studentId, fileCategory);
      this.setState({ category: "" });
    }
  };

  handleCreateGeneralMessageThread = (e, studentId, fileCategory) => {
    e.preventDefault();
    // console.log(e.target.files);
    if (!this.state.category) {
      alert("Please select file type");
    } else {
      this.props.initGeneralFileThread(e, studentId, fileCategory);
      this.setState({ category: "" });
    }
  };

  handleCreateProgramSpecificMessageThread = (
    e,
    studentId,
    programId,
    fileCategory
  ) => {
    e.preventDefault();
    // console.log(e.target.files);
    if (!this.state.category) {
      alert("Please select file type");
    } else {
      this.props.initProgramSpecificFileThread(
        e,
        studentId,
        programId,
        fileCategory
      );
      this.setState({ category: "" });
    }
  };

  handleSelect = (e) => {
    e.preventDefault();
    // console.log(e.target.value);
    this.setState({ category: e.target.value });
  };
  render() {
    return (
      <>
        {this.props.filetype === "General" ? (
          <>
            <Table>
              <thead>
                <tr></tr>
              </thead>
              <tbody>
                <ManualFilesList
                  filetype={this.props.filetype}
                  student={this.props.student}
                  onDownloadGeneralFile={this.props.onDownloadGeneralFile}
                  onCommentsGeneralFile={this.props.onCommentsGeneralFile}
                  onDeleteGeneralFile={this.props.onDeleteGeneralFile}
                  onStudentFeedbackGeneral={this.props.onStudentFeedbackGeneral}
                  handleAsFinalGeneralFile={this.props.handleAsFinalGeneralFile}
                  role={this.props.role}
                />
              </tbody>
            </Table>
            {this.props.role === "Agent" ||
            this.props.role === "Admin" ||
            this.props.role === "Editor" ||
            this.props.role === "Student" ? (
              <ToggleableUploadFileForm
                role={this.props.role}
                student={this.props.student}
                handleSelect={this.handleSelect}
                handleProgramSpecificFormSubmit={
                  this.handleProgramSpecificFormSubmit
                }
                handleGeneralDocSubmit={this.handleGeneralDocSubmit}
                handleCreateGeneralMessageThread={
                  this.handleCreateGeneralMessageThread
                }
                handleCreateProgramSpecificMessageThread={
                  this.handleCreateProgramSpecificMessageThread
                }
                category={this.state.category}
                filetype={this.props.filetype}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <Table>
              <thead>
                <tr></tr>
              </thead>
              <tbody>
                <ManualFilesList
                  filetype={this.props.filetype}
                  application={this.props.application}
                  student={this.props.student}
                  onCommentsProgramSpecific={
                    this.props.onCommentsProgramSpecific
                  }
                  onStudentFeedbackProgramSpecific={
                    this.props.onStudentFeedbackProgramSpecific
                  }
                  onDownloadProgramSpecificFile={
                    this.props.onDownloadProgramSpecificFile
                  }
                  onDeleteProgramSpecificFile={
                    this.props.onDeleteProgramSpecificFile
                  }
                  handleAsFinalProgramSpecific={
                    this.props.handleAsFinalProgramSpecific
                  }
                  role={this.props.role}
                />
              </tbody>
            </Table>

            {this.props.role === "Agent" ||
            this.props.role === "Admin" ||
            this.props.role === "Editor" ||
            this.props.role === "Student" ? (
              <ToggleableUploadFileForm
                role={this.props.role}
                student={this.props.student}
                filetype={this.props.filetype}
                handleSelect={this.handleSelect}
                handleProgramSpecificFormSubmit={
                  this.handleProgramSpecificFormSubmit
                }
                handleGeneralDocSubmit={this.handleGeneralDocSubmit}
                handleCreateGeneralMessageThread={
                  this.handleCreateGeneralMessageThread
                }
                handleCreateProgramSpecificMessageThread={
                  this.handleCreateProgramSpecificMessageThread
                }
                category={this.state.category}
                application={this.props.application}
              />
            ) : (
              <></>
            )}
          </>
        )}
      </>
    );
  }
}

export default ManualFiles;
