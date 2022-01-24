import React from "react";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import { uploadforstudent } from "../../../../api";
import DocsProgress from "./DocsProgress";

class EditorDocsProgress extends React.Component {
  state = {
    showFilePage: false,
    student: this.props.student,
    file: "",
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
      console.log(category);
      // stud.uploadedDocs_[category].uploadStatus_ = "uploaded";
      this.onSubmitFile(e, category, student_id, this.state.file);
      this.setState({
        student: stud,
        file: "",
      });
    }
  };

  onRejectFilefromstudent = (e, category, id) => {
    let stud = { ...this.state.student };
    stud.uploadedDocs_[category].uploadStatus_ = "unaccepted";
    console.log(stud);
    this.props.onRejectFilefromstudent(e, category, id);
    this.setState({
      student: stud,
    });
  };

  onAcceptFilefromstudent = (e, category, id) => {
    let stud = { ...this.state.student };
    stud.uploadedDocs_[category].uploadStatus_ = "checked";
    console.log(stud);
    this.props.onAcceptFilefromstudent(e, category, id);
    this.setState({
      student: stud,
    });
  };

  onDeleteFilefromstudent = (e, category, id) => {
    // TODO: delete this.state.student[document]
    let stud = { ...this.state.student };
    delete stud.uploadedDocs_[category];
    console.log(stud);
    this.props.onDeleteFilefromstudent(e, category, id);
    this.setState({
      student: stud,
    });
  };

  render() {
    return (
      <DocsProgress
        role={this.props.role}
        startUploadfile={this.startUploadfile}
        student={this.state.student}
        setFilesModalhide={this.setFilesModalhide}
        onFileChange={this.onFileChange}
        submitFile={this.submitFile}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.onDeleteFilefromstudent}
      />
    );
  }
}

export default EditorDocsProgress;
