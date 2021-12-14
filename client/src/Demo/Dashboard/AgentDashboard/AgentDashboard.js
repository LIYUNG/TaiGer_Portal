import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Card, Col, Row, Table } from "react-bootstrap";
import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import EditProgramsSubpage from "./EditProgramsSubpage";
import EditFilesSubpage from "./EditFilesSubpage";
import {
  // getStudents,
  uploadforstudent,
  updateDocumentStatus,
  deleteFile,
} from "../../../api";
class AgentDashboard extends React.Component {
  state = {
    showProgramPage: false,
    showFilePage: false,
    student: this.props.student,
    file: "",
  };

  setProgramModalhide = () => {
    this.setState({
      showProgramPage: false,
    });
  };

  startEditingProgram = () => {
    console.log("startEditingProgram");
    this.setState({
      showProgramPage: true,
    });
  };

  setFilesModalhide = () => {
    this.setState({
      showFilePage: false,
    });
  };

  startUploadfile = () => {
    console.log("startUploadfile");
    this.setState({
      showFilePage: true,
    });
  };

  onFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };

  onSubmitFile = (e, category, student_id) => {
    if (this.state.file === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", this.state.file);

      uploadforstudent(category, student_id, formData).then(
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

  onDeleteFilefromstudent = (e, category, id) => {
    // TODO: delete this.state.student[document]
    e.preventDefault();
    let idx = this.state.student.profile.findIndex(
      (doc) => doc.name === category
    );
    let std = { ...this.state.student };
    console.log(std);
    deleteFile(category, id).then(
      (res) => {
        std.profile[idx] = res.data.data; // res.data = {success: true, data:{...}}
        this.setState({
          student: std,
        });
      },
      (error) => {}
    );
  };

  onUpdateProfileDocStatus = (e, category, id, status) => {
    e.preventDefault();
    let stud = { ...this.state.student };
    let idx = this.state.student.profile.findIndex(
      (doc) => doc.name === category
    );
    var std = { ...this.state.student };
    console.log(std);
    updateDocumentStatus(category, id, status).then(
      (res) => {
        std.profile[idx] = res.data.data; // res.data = {success: true, data:{...}}
        this.setState({
          student: std,
        });
      },
      (error) => {}
    );
  };

  render() {
    let studentDocOverview;
    let keys = Object.keys(this.props.documentlist2);
    let object_init = new Object();
    for (let i = 0; i < keys.length; i++) {
      object_init[keys[i]] = "missing";
    }
    if (this.state.student.profile) {
      for (let i = 0; i < this.state.student.profile.length; i++) {
        if (this.state.student.profile[i].status === "uploaded") {
          object_init[this.state.student.profile[i].name] = "uploaded";
        } else if (this.state.student.profile[i].status === "accepted") {
          object_init[this.state.student.profile[i].name] = "accepted";
        } else if (this.state.student.profile[i].status === "rejected") {
          object_init[this.state.student.profile[i].name] = "rejected";
        } else if (this.state.student.profile[i].status === "missing") {
          object_init[this.state.student.profile[i].name] = "missing";
        }
      }
    } else {
      console.log("no files");
    }
    studentDocOverview = keys.map((k, i) => {
      if (object_init[k] === "uploaded") {
        return (
          <td key={i}>
            <AiOutlineFieldTime
              size={24}
              color="orange"
              title="Uploaded successfully"
            />{" "}
          </td>
        );
      } else if (object_init[k] === "accepted") {
        return (
          <td key={i}>
            <IoCheckmarkCircle
              size={24}
              color="limegreen"
              title="Valid Document"
            />{" "}
          </td>
        );
      } else if (object_init[k] === "rejected") {
        return (
          <td key={i}>
            <AiFillCloseCircle size={24} color="red" title="Invalid Document" />{" "}
          </td>
        );
      } else {
        return (
          <td key={i}>
            <AiFillQuestionCircle
              size={24}
              color="lightgray"
              title="No Document uploaded"
            />{" "}
          </td>
        );
      }
    });
    return (
      <>
        <tbody>
          <tr>
            <>
              <td>
                <DropdownButton
                  className="btn ml-2"
                  size="sm"
                  title="Option"
                  variant="primary"
                  id={`dropdown-variants-${this.state.student._id}`}
                  key={this.props.student._id}
                >
                  <Dropdown.Item
                    eventKey="3"
                    onSelect={() => this.startEditingProgram()}
                  >
                    Edit Program
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="4"
                    onSelect={() => this.startUploadfile()}
                  >
                    Edit File Status
                  </Dropdown.Item>
                </DropdownButton>
              </td>
              <td>
                {this.props.student.firstname} /{this.props.student.lastname}
              </td>
            </>
            {studentDocOverview}
          </tr>
        </tbody>
        <>
          <EditProgramsSubpage
            student={this.state.student}
            show={this.state.showProgramPage}
            onHide={this.setProgramModalhide}
            setmodalhide={this.setProgramModalhide}
            onDeleteProgram={this.props.onDeleteProgram}
          />
          <EditFilesSubpage
            student={this.state.student}
            documentslist={this.props.documentslist}
            documentlist2={this.props.documentlist2}
            show={this.state.showFilePage}
            onHide={this.setFilesModalhide}
            setmodalhide={this.setFilesModalhide}
            onFileChange={this.onFileChange}
            onSubmitFile={this.onSubmitFile}
            onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
            onUpdateProfileDocStatus={this.onUpdateProfileDocStatus}
            onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          />
        </>
      </>
    );
  }
}

export default AgentDashboard;
