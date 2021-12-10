import React from "react";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";

import { Card, Col, Row } from "react-bootstrap";

import { Dropdown, DropdownButton } from "react-bootstrap";
import avatar1 from "../../assets/images/user/avatar-1.jpg";

import { uploadforstudent } from "../../api";
import AgentDashboard from "./AgentDashboard";
import EditorDashboard from "./EditorDashboard";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import GuestDashboard from "./GuestDashboard";

class AdminStudents extends React.Component {
  state = {
    showAgentPage: false,
    showEditorPage: false,
    showProgramPage: false,
    showFilePage: false,
    student: this.props.student,
    file: "",
  };

  setAgentModalhide = () => {
    this.setState({
      showAgentPage: false,
    });
  };

  startEditingAgent = (student) => {
    console.log("startEditingAgent");
    console.log(student);
    this.props.editAgent(student);
    this.setState({
      subpage: 1,
      showAgentPage: true,
    });
  };

  setEditorModalhide = () => {
    this.setState({
      showEditorPage: false,
    });
  };

  startEditingEditor = (student) => {
    console.log("startEditingEditor");
    console.log(student);
    this.props.editEditor(student);
    this.setState({
      subpage: 2,
      showEditorPage: true,
    });
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
    let studentDocOverview;
    // studentDocOverview = <p>So far no uploaded file!</p>;
    // if (this.state.student.uploadedDocs_) {
    //   studentDocOverview = this.props.documentslist.map((doc, i) => {
    //     if (
    //       this.state.student.uploadedDocs_[doc.prop] &&
    //       this.state.student.uploadedDocs_[doc.prop].uploadStatus_ ===
    //         "uploaded"
    //     ) {
    //       return (
    //         <p className="m-0" key={i}>
    //           {" "}
    //           <AiFillQuestionCircle
    //             size={24}
    //             color="lightgreen"
    //             title="Uploaded successfully"
    //           />{" "}
    //           {doc.name}
    //         </p>
    //       );
    //     } else if (
    //       this.state.student.uploadedDocs_[doc.prop] &&
    //       this.state.student.uploadedDocs_[doc.prop].uploadStatus_ === "checked"
    //     ) {
    //       return (
    //         <p className="m-0" key={i}>
    //           <IoCheckmarkCircle
    //             size={24}
    //             color="limegreen"
    //             title="Valid Document"
    //           />{" "}
    //           {doc.name}
    //         </p>
    //       );
    //     } else if (
    //       this.state.student.uploadedDocs_[doc.prop] &&
    //       this.state.student.uploadedDocs_[doc.prop].uploadStatus_ ===
    //         "unaccepted"
    //     ) {
    //       return (
    //         <p className="m-0" key={i}>
    //           <AiFillCloseCircle
    //             size={24}
    //             color="red"
    //             title="Invalid Document"
    //           />{" "}
    //           {doc.name}
    //         </p>
    //       );
    //     } else {
    //       return (
    //         <p className="m-0" key={i}>
    //           <b>
    //             <AiFillQuestionCircle
    //               size={24}
    //               color="lightgray"
    //               title="No Document uploaded"
    //             />{" "}
    //             {doc.name}{" "}
    //           </b>
    //         </p>
    //       );
    //     }
    //   });
    // } else {
    //   studentDocOverview = <p>So far no uploaded file!</p>;
    // }

    if (this.state.student.uploadedDocs_) {
      studentDocOverview = this.props.documentslist.map((doc, i) => {
        if (
          this.state.student.uploadedDocs_[doc.prop] &&
          this.state.student.uploadedDocs_[doc.prop].uploadStatus_ ===
            "uploaded"
        ) {
          return (
            <td key={i}>
              <AiFillQuestionCircle
                size={24}
                color="lightgreen"
                title="Uploaded successfully"
              />{" "}
            </td>
          );
        } else if (
          this.state.student.uploadedDocs_[doc.prop] &&
          this.state.student.uploadedDocs_[doc.prop].uploadStatus_ === "checked"
        ) {
          return (
            <td key={i}>
              <IoCheckmarkCircle
                size={24}
                color="limegreen"
                title="Valid Document"
              />{" "}
            </td>
          );
        } else if (
          this.state.student.uploadedDocs_[doc.prop] &&
          this.state.student.uploadedDocs_[doc.prop].uploadStatus_ ===
            "unaccepted"
        ) {
          return (
            <td key={i}>
              <AiFillCloseCircle
                size={24}
                color="red"
                title="Invalid Document"
              />{" "}
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
    } else {
      studentDocOverview = <p>No Doc!</p>;
    }
    return (
      <AdminDashboard
        role={this.props.role}
        agent_list={this.props.agent_list}
        editor_list={this.props.editor_list}
        startEditingAgent={this.startEditingAgent}
        startEditingEditor={this.startEditingEditor}
        startEditingProgram={this.startEditingProgram}
        startUploadfile={this.startUploadfile}
        student={this.state.student}
        studentDocOverview={studentDocOverview}
        setAgentModalhide={this.setAgentModalhide}
        updateAgentList={this.props.updateAgentList}
        handleChangeAgentlist={this.props.handleChangeAgentlist}
        submitUpdateAgentlist={this.props.submitUpdateAgentlist}
        setEditorModalhide={this.setEditorModalhide}
        updateEditorList={this.props.updateEditorList}
        handleChangeEditorlist={this.props.handleChangeEditorlist}
        submitUpdateEditorlist={this.props.submitUpdateEditorlist}
        setProgramModalhide={this.setProgramModalhide}
        onDeleteProgram={this.props.onDeleteProgram}
        setFilesModalhide={this.setFilesModalhide}
        onFileChange={this.onFileChange}
        submitFile={this.submitFile}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.onDeleteFilefromstudent}
        documentslist={this.props.documentslist}
        showAgentPage={this.state.showAgentPage}
        showEditorPage={this.state.showEditorPage}
        showProgramPage={this.state.showProgramPage}
        showFilePage={this.state.showFilePage}
      />
    );

    // }
  }
}

export default AdminStudents;
