import React from "react";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import { uploadforstudent } from "../../../../api";
import ApplicationStatus from "./ApplicationStatus";

class ApplicationProgress extends React.Component {
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

  setFilesModalhide = () => {
    this.setState({
      showFilePage: false,
    });
  };

  onFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };

  onSubmitFile = (e, id, student_id, file) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    uploadforstudent(id, student_id, formData).then(
      (res) => {},
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  };

  submitFile = (e, category, student_id) => {
    if (this.state.file === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      // e.preventDefault();
      let stud = { ...this.state.student };
      // stud.uploadedDocs_[category].uploadStatus_ = "uploaded";
      this.onSubmitFile(e, category, student_id, this.state.file);
      this.setState({
        student: stud,
        file: "",
      });
    }
  };

  render() {
    return (
      <ApplicationStatus
        role={this.props.role}
        student={this.props.student}
        setProgramModalhide={this.setProgramModalhide}
        setFilesModalhide={this.setFilesModalhide}
        onFileChange={this.onFileChange}
        submitFile={this.submitFile}
      />
    );
  }
}

export default ApplicationProgress;
