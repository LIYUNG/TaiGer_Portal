import React from "react";
import { Button, Table, Modal } from "react-bootstrap";
import ManualFiles from "./ManualFiles";
import {
  createManualFileUploadPlace,
  deleteProgramSpecificFileUpload,
  uploadHandwrittenFileforstudent,
  downloadHandWrittenFile,
} from "../../../../api";
class EditProgramsFilesSubpage extends React.Component {
  // edit File subpage
  state = {
    student: this.props.student,
    file: "",
  };
  onFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
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

  deleteManualFileUploadPlaceholder = (studentId, applicationId, docName) => {
    deleteProgramSpecificFileUpload(studentId, applicationId, docName).then(
      (resp) => {
        console.log(resp.data.data);
        this.setState({
          student: resp.data.data,
        });
      },
      (error) => {}
    );
  };

  onSubmitFile = (e, studentId, applicationId, docName) => {
    if (this.state.file === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", this.state.file);

      uploadHandwrittenFileforstudent(
        studentId,
        applicationId,
        docName,
        formData
      ).then(
        (res) => {
          this.setState({
            student: res.data.data, // res.data = {success: true, data:{...}}
            file: "",
          });
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

  onDownloadFile(e, studentId, applicationId, docName) {
    e.preventDefault();
    downloadHandWrittenFile(studentId, applicationId, docName).then(
      (resp) => {
        const actualFileName =
          resp.headers["content-disposition"].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split("."); //split file name
        filetype = filetype.pop(); //get the file type

        if (filetype === "pdf") {
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          //Open the URL on new Window
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

  onDeleteFile = (e, studentId, applicationId, docName) => {
    e.preventDefault();
    deleteProgramSpecificFileUpload(studentId, applicationId, docName).then(
      (res) => {
        this.setState({
          student: res.data.data,
        });
      },
      (error) => {}
    );
  };

  render() {
    // Edit Program
    let programstatus;
    if (this.state.student.applications) {
      programstatus = this.state.student.applications.map((application, i) => (
        <div key={application._id}>
          <tr>
            {/* <th></th> */}
            <td>
              <h4 className="mb-1">
                {application.programId.school} -{" "}
                {application.programId.program_name}
              </h4>
              <p className="mb-1">{application.programId.documents}</p>
            </td>
            <td></td>
          </tr>
          <tr>
            <ManualFiles
              createManualFileUploadPlaceholder={
                this.createManualFileUploadPlaceholder
              }
              deleteManualFileUploadPlaceholder={
                this.deleteManualFileUploadPlaceholder
              }
              onFileChange={this.onFileChange}
              onSubmitFile={this.onSubmitFile}
              onDownloadFile={this.onDownloadFile}
              onDeleteFile={this.onDeleteFile}
              role={this.props.role}
              student={this.state.student}
              application={application}
            />
          </tr>
        </div>
      ));
    } else {
      programstatus = (
        <tr>
          <td>
            <h4 className="mb-1"> No Program</h4>
          </td>
        </tr>
      );
    }
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Program for {this.state.student.firstname} -{" "}
            {this.state.student.lastname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <tbody>{programstatus}</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.setmodalhide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditProgramsFilesSubpage;
