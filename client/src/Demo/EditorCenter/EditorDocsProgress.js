import React from "react";
import DEMO from "../../store/constant";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import { Row, Col, Button, Card, Collapse, Spinner } from "react-bootstrap";
import {
  createManualFileUploadPlace,
  deleteManualFileUpload,
  uploadHandwrittenFileforstudent,
  downloadHandWrittenFile,
} from "../../api";
import ManualFiles from "./ManualFiles";

class EditorDocsProgress extends React.Component {
  state = {
    student: this.props.student,
    file: "",
  };

  createManualFileUploadPlaceholder = (studentId, applicationId, docName) => {
    createManualFileUploadPlace(studentId, applicationId, docName).then(
      (resp) => {
        console.log(resp.data.data);
        this.setState({
          student: resp.data.data,
        });
      },
      (error) => {}
    );
  };

  onDeleteFile = (studentId, applicationId, docName, whoupdate) => {
    deleteManualFileUpload(studentId, applicationId, docName, whoupdate).then(
      (resp) => {
        console.log(resp.data.data);
        this.setState({
          student: resp.data.data,
        });
      },
      (error) => {}
    );
  };

  onSubmitFile = (e, NewFile, studentId, applicationId) => {
    if (NewFile === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", NewFile);

      uploadHandwrittenFileforstudent(studentId, applicationId, formData).then(
        (res) => {
          if (res.status === 400) {
            alert("Uploading file failed. Same file name");
          } else {
            console.log(res);
            this.setState({
              student: res.data.data, // res.data = {success: true, data:{...}}
              file: "",
            });
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
    }
  };
  onFileChange = (e, studentId, applicationId) => {
    this.onSubmitFile(e, e.target.files[0], studentId, applicationId);
    // this.setState({
    //   file: e.target.files[0],
    // });
  };
  onDownloadFile(e, studentId, applicationId, docName, student_inputs) {
    e.preventDefault();
    downloadHandWrittenFile(
      studentId,
      applicationId,
      docName,
      student_inputs
    ).then(
      (resp) => {
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
      },
      (error) => {
        alert("The file is not available.");
      }
    );
  }

  render() {
    return (
      <Card className="mt-2" key={this.props.idx}>
        <Card.Header>
          <Card.Title as="h5">
            <a
              onClick={() => this.props.singleExpandtHandler(this.props.idx)}
              aria-controls={"accordion" + this.props.idx}
              aria-expanded={
                this.props.accordionKeys[this.props.idx] === this.props.idx
              }
            >
              {this.state.student.firstname}
              {" ,"}
              {this.state.student.lastname}
            </a>
          </Card.Title>
        </Card.Header>
        <Collapse
          in={this.props.accordionKeys[this.props.idx] === this.props.idx}
        >
          <div id="accordion1">
            <Card.Body>
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
                  <Row>
                    <Col md={6}>
                      <strong>Editor output</strong>
                    </Col>
                    <Col md={6}>
                      <strong>Student input</strong>
                    </Col>
                  </Row>
                  <ManualFiles
                    createManualFileUploadPlaceholder={
                      this.createManualFileUploadPlaceholder
                    }
                    onDeleteFile={this.onDeleteFile}
                    onFileChange={this.onFileChange}
                    onSubmitFile={this.onSubmitFile}
                    onDownloadFile={this.onDownloadFile}
                    role={this.props.role}
                    student={this.state.student}
                    application={application}
                  />
                </>
              ))}
              {/* {JSON.stringify(student)} */}
            </Card.Body>
          </div>
        </Collapse>
      </Card>
    );
  }
}

export default EditorDocsProgress;
