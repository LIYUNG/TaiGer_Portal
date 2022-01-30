import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDash } from "react-icons/bs";
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import EditAgentsSubpage from "./EditAgentsSubpage";
import EditEditorsSubpage from "./EditEditorsSubpage";
import EditProgramsSubpage from "./EditProgramsSubpage";

class StudDocsDashboard extends React.Component {
  state = {
    showAgentPage: false,
    showEditorPage: false,
    showProgramPage: false,
    showFilePage: false,
  };

  setAgentModalhide = () => {
    this.setState({
      showAgentPage: false,
    });
  };

  startEditingAgent = (student) => {
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
    this.setState({
      showFilePage: true,
    });
  };
  submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    this.setAgentModalhide();
    this.props.submitUpdateAgentlist(e, updateAgentList, student_id);
  };

  submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    this.setEditorModalhide();
    this.props.submitUpdateEditorlist(e, updateEditorList, student_id);
  };
  updateStudentArchivStatus = (studentId, isArchived) => {
    this.props.updateStudentArchivStatus(studentId, isArchived);
  };
  render() {
    let studentDocOverview;
    let keys = Object.keys(this.props.documentlist2);
    let object_init = {};
    for (let i = 0; i < keys.length; i++) {
      object_init[keys[i]] = "missing";
    }

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === "uploaded") {
          object_init[this.props.student.profile[i].name] = "uploaded";
        } else if (this.props.student.profile[i].status === "accepted") {
          object_init[this.props.student.profile[i].name] = "accepted";
        } else if (this.props.student.profile[i].status === "rejected") {
          object_init[this.props.student.profile[i].name] = "rejected";
        } else if (this.props.student.profile[i].status === "missing") {
          object_init[this.props.student.profile[i].name] = "missing";
        } else if (this.props.student.profile[i].status === "notneeded") {
          object_init[this.props.student.profile[i].name] = "notneeded";
        }
      }
    } else {
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
      } else if (object_init[k] === "notneeded") {
        return (
          <td key={i}>
            <BsDash size={24} color="lightgray" title="Not needed" />
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
                  id={`dropdown-variants-${this.props.student._id}`}
                  key={this.props.student._id}
                >
                  {this.props.role === "Admin" && !this.props.isArchivPage ? (
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
                  {this.props.role !== "Editor" && !this.props.isArchivPage ? (
                    <Dropdown.Item
                      eventKey="3"
                      onSelect={() => this.startEditingProgram()}
                    >
                      Edit Program
                    </Dropdown.Item>
                  ) : (
                    <></>
                  )}
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
                {this.props.student.firstname}, {this.props.student.lastname}
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
                student={this.props.student}
                agent_list={this.props.agent_list}
                show={this.state.showAgentPage}
                onHide={this.setAgentModalhide}
                setmodalhide={this.setAgentModalhide}
                updateAgentList={this.props.updateAgentList}
                handleChangeAgentlist={this.props.handleChangeAgentlist}
                submitUpdateAgentlist={this.submitUpdateAgentlist}
              />
              <EditEditorsSubpage
                student={this.props.student}
                editor_list={this.props.editor_list}
                show={this.state.showEditorPage}
                onHide={this.setEditorModalhide}
                setmodalhide={this.setEditorModalhide}
                updateEditorList={this.props.updateEditorList}
                handleChangeEditorlist={this.props.handleChangeEditorlist}
                submitUpdateEditorlist={this.submitUpdateEditorlist}
              />
            </>
          ) : (
            <></>
          )}
          <EditProgramsSubpage
            student={this.props.student}
            show={this.state.showProgramPage}
            onHide={this.setProgramModalhide}
            setmodalhide={this.setProgramModalhide}
            onDeleteProgram={this.props.onDeleteProgram}
          />
  
        </>
      </>
    );
  }
}

export default StudDocsDashboard;
