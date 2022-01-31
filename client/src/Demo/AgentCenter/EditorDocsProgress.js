import React from "react";
import DEMO from "../../store/constant";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import { Row, Col, Button, Card, Collapse, Modal } from "react-bootstrap";
import {
  deleteManualFileUpload,
  deleteGenralFileUpload,
  uploadHandwrittenFileforstudent,
  uploadEditGeneralFileforstudent,
  downloadHandWrittenFile,
  downloadGeneralHandWrittenFile,
} from "../../api";
import ManualFiles from "./ManualFiles";

class EditorDocsProgress extends React.Component {
  state = {
    student: this.props.student,
    deleteFileWarningModel: false,
    studentId: "",
    applicationId: "",
    docName: "",
    whoupdate: "",
    file: "",
  };

  onSubmitProgramSpecificFile = (
    e,
    NewFile,
    studentId,
    applicationId,
    fileCategory
  ) => {
    if (NewFile === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", NewFile);

      uploadHandwrittenFileforstudent(
        studentId,
        applicationId,
        fileCategory,
        formData
      )
        .then((res) => {
          console.log(res.data);
          const { data, success } = res.data;
          if (success) {
            this.setState({
              isLoaded: true, //false to reload everything
              student: data,
              success: success,
              file: "",
            });
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onSubmitGeneralFile = (e, NewFile, studentId, fileCategory) => {
    if (NewFile === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", NewFile);

      uploadEditGeneralFileforstudent(studentId, fileCategory, formData)
        .then((res) => {
          console.log(res.data);
          const { data, success } = res.data;
          if (success) {
            this.setState({
              isLoaded: true,
              student: data,
              success: success,
              file: "",
            });
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  SubmitProgramSpecificFile = (e, studentId, applicationId, fileCategory) => {
    this.onSubmitProgramSpecificFile(
      e,
      e.target.files[0],
      studentId,
      applicationId,
      fileCategory
    );
  };

  SubmitGeneralFile = (e, studentId, fileCategory) => {
    this.onSubmitGeneralFile(e, e.target.files[0], studentId, fileCategory);
  };

  onDownloadProgramSpecificFile = (
    e,
    studentId,
    applicationId,
    docName,
    student_inputs
  ) => {
    e.preventDefault();
    downloadHandWrittenFile(studentId, applicationId, docName, student_inputs)
      .then((resp) => {
        console.log(resp);
        const actualFileName =
          resp.headers["content-disposition"].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split("."); //split file name
        filetype = filetype.pop(); //get the file type

        if (filetype === "pdf") {
          console.log(blob);
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          //Open the URL on new Window
          console.log(url);
          window.open(url); //TODO: having a reasonable file name, pdf viewer
        } else {
          //if not pdf, download instead.

          const url = window.URL.createObjectURL(new Blob([blob]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", actualFileName);
          // Append to html link element page
          document.body.appendChild(link);
          // Start download
          link.click();
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        }
      })
      .catch((err) => {
        alert("The file is not available.");
      });
  };
  onDownloadGeneralFile = (e, studentId, docName, student_inputs) => {
    e.preventDefault();
    downloadGeneralHandWrittenFile(studentId, docName, student_inputs)
      .then((resp) => {
        console.log(resp);
        const actualFileName =
          resp.headers["content-disposition"].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split("."); //split file name
        filetype = filetype.pop(); //get the file type

        if (filetype === "pdf") {
          console.log(blob);
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          //Open the URL on new Window
          console.log(url);
          window.open(url); //TODO: having a reasonable file name, pdf viewer
        } else {
          //if not pdf, download instead.

          const url = window.URL.createObjectURL(new Blob([blob]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", actualFileName);
          // Append to html link element page
          document.body.appendChild(link);
          // Start download
          link.click();
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  render() {
    return (
      <>
        <Card className="mt-2" key={this.props.idx}>
          <Card.Header
            onClick={() => this.props.singleExpandtHandler(this.props.idx)}
          >
            <Card.Title
              as="h5"
              aria-controls={"accordion" + this.props.idx}
              aria-expanded={
                this.props.accordionKeys[this.props.idx] === this.props.idx
              }
            >
              {this.state.student.firstname}
              {" ,"}
              {this.state.student.lastname}
            </Card.Title>
          </Card.Header>
          <Collapse
            in={this.props.accordionKeys[this.props.idx] === this.props.idx}
          >
            <div id="accordion1">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6>Editor output</h6>
                  </Col>
                  <Col md={6}>
                    <h6>Student input</h6>
                  </Col>
                </Row>
                <Row>
                  <Col md={8}>
                    <h5>General Documents (CV, Recommendation Letters)</h5>
                  </Col>
                </Row>
                <ManualFiles
                  onDeleteGeneralFile={this.onDeleteGeneralFile}
                  onDownloadGeneralFile={this.onDownloadGeneralFile}
                  SubmitGeneralFile={this.SubmitGeneralFile}
                  role={this.props.role}
                  student={this.state.student}
                  filetype={"General"}
                />
                {this.state.student.applications.map((application, i) => (
                  <>
                    <Row>
                      <Col md={6}>
                        <h5>
                          {application.programId.University_}
                          {" - "}
                          {application.programId.Program_}
                        </h5>
                      </Col>
                    </Row>

                    <ManualFiles
                      onDeleteFile={this.onDeleteFile}
                      SubmitProgramSpecificFile={this.SubmitProgramSpecificFile}
                      onDownloadProgramSpecificFile={
                        this.onDownloadProgramSpecificFile
                      }
                      role={this.props.role}
                      student={this.state.student}
                      application={application}
                      filetype={"ProgramSpecific"}
                    />
                  </>
                ))}
                {/* {JSON.stringify(student)} */}
              </Card.Body>
            </div>
          </Collapse>
        </Card>
      </>
    );
  }
}

export default EditorDocsProgress;
