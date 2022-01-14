import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import EditAgentsSubpage from "./EditAgentsSubpage";
import EditEditorsSubpage from "./EditEditorsSubpage";
import EditProgramsSubpage from "./EditProgramsSubpage";
import EditFilesSubpage from "./EditFilesSubpage";
import {
  uploadforstudent,
  updateDocumentStatus,
  deleteFile,
} from "../../../../api";
class StudDocsDashboard extends React.Component {
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

  updateStudentArchivStatus = (studentId, isArchived) => {
    this.props.updateStudentArchivStatus(studentId, isArchived);
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
            />
          </td>
        );
      } else if (object_init[k] === "accepted") {
        return (
          <td key={i}>
            <IoCheckmarkCircle
              size={24}
              color="limegreen"
              title="Valid Document"
            />
          </td>
        );
      } else if (object_init[k] === "rejected") {
        return (
          <td key={i}>
            <AiFillCloseCircle size={24} color="red" title="Invalid Document" />
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
                  {this.props.role === "Admin" ? (
                    <>
                      <Dropdown.Item
                        eventKey="1"
                        onSelect={() =>
                          this.startEditingAgent(this.props.student)
                        }
                      >
                        Edit Agent
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey="2"
                        onSelect={() =>
                          this.startEditingEditor(this.props.student)
                        }
                      >
                        Edit Editor
                      </Dropdown.Item>
                    </>
                  ) : (
                    <></>
                  )}
                  {this.props.role !== "Editor" ? (
                    <Dropdown.Item
                      eventKey="3"
                      onSelect={() => this.startEditingProgram()}
                    >
                      Edit Program
                    </Dropdown.Item>
                  ) : (
                    <></>
                  )}
                  <Dropdown.Item
                    eventKey="4"
                    onSelect={() => this.startUploadfile()}
                  >
                    Edit File Status
                  </Dropdown.Item>
                  {this.props.isDashboard ? (
                    <Dropdown.Item
                      eventKey="5"
                      onSelect={() =>
                        this.updateStudentArchivStatus(
                          this.props.student._id,
                          true
                        )
                      }
                    >
                      Move to Archiv
                    </Dropdown.Item>
                  ) : (
                    <></>
                  )}
                  {this.props.isArchivPage ? (
                    <Dropdown.Item
                      eventKey="6"
                      onSelect={() =>
                        this.updateStudentArchivStatus(
                          this.props.student._id,
                          false
                        )
                      }
                    >
                      Move to Active
                    </Dropdown.Item>
                  ) : (
                    <></>
                  )}
                </DropdownButton>
              </td>
              <td>
                {this.state.student.firstname}, {this.state.student.lastname}
                <br />
                {this.props.student.email}
              </td>
            </>
            {studentDocOverview}
          </tr>
        </tbody>
        <>
          {this.props.role === "Admin" ? (
            <>
              <EditAgentsSubpage
                student={this.state.student}
                agent_list={this.props.agent_list}
                show={this.state.showAgentPage}
                onHide={this.setAgentModalhide}
                setmodalhide={this.setAgentModalhide}
                updateAgentList={this.props.updateAgentList}
                handleChangeAgentlist={this.props.handleChangeAgentlist}
                submitUpdateAgentlist={this.props.submitUpdateAgentlist}
              />
              <EditEditorsSubpage
                student={this.state.student}
                editor_list={this.props.editor_list}
                show={this.state.showEditorPage}
                onHide={this.setEditorModalhide}
                setmodalhide={this.setEditorModalhide}
                updateEditorList={this.props.updateEditorList}
                handleChangeEditorlist={this.props.handleChangeEditorlist}
                submitUpdateEditorlist={this.props.submitUpdateEditorlist}
              />
            </>
          ) : (
            <></>
          )}
          <EditProgramsSubpage
            student={this.state.student}
            show={this.state.showProgramPage}
            onHide={this.setProgramModalhide}
            setmodalhide={this.setProgramModalhide}
            onDeleteProgram={this.props.onDeleteProgram}
          />
          <EditFilesSubpage
            student={this.state.student}
            role={this.props.role}
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

export default StudDocsDashboard;
