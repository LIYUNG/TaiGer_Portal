import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import EditAgentsSubpage from '../StudDocsOverview/EditAgentsSubpage';
import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
class StudentsAgentEditor extends React.Component {
  state = {
    showAgentPage: false,
    showEditorPage: false
  };

  setAgentModalhide = () => {
    this.setState({
      showAgentPage: false
    });
  };

  startEditingAgent = (student) => {
    this.props.editAgent(student);
    this.setState({
      subpage: 1,
      showAgentPage: true
    });
  };

  setEditorModalhide = () => {
    this.setState({
      showEditorPage: false
    });
  };

  startEditingEditor = (student) => {
    this.props.editEditor(student);
    this.setState({
      subpage: 2,
      showEditorPage: true
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

  render() {
    let studentsAgent;
    let studentsEditor;
    if (
      this.props.student.agents === undefined ||
      this.props.student.agents.length === 0
    ) {
      studentsAgent = <h6 className="mb-1"> No Agent assigned</h6>;
    } else {
      studentsAgent = this.props.student.agents.map((agent, i) => (
        <div key={agent._id}>
          <h6 className="mb-1">
            {agent.firstname}
            {', '}
            {agent.lastname}
          </h6>
          {agent.email}
        </div>
      ));
    }
    if (
      this.props.student.editors === undefined ||
      this.props.student.editors.length === 0
    ) {
      studentsEditor = <h6 className="mb-1"> No Editor assigned</h6>;
    } else {
      studentsEditor = this.props.student.editors.map((editor, i) => (
        <div key={editor._id}>
          <h6 className="mb-1">
            {editor.firstname}
            {', '}
            {editor.lastname}
          </h6>
          {editor.email}
        </div>
      ));
    }
    return (
      <>
        <tr>
          {this.props.role === 'Admin' && !this.props.isArchivPage && (
            <td>
              <DropdownButton
                size="sm"
                title="Option"
                variant="primary"
                id={`dropdown-variants-${this.props.student._id}`}
                key={this.props.student._id}
              >
                <Dropdown.Item
                  eventKey="1"
                  onSelect={() => this.startEditingAgent(this.props.student)}
                >
                  Edit Agent
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onSelect={() => this.startEditingEditor(this.props.student)}
                >
                  Edit Editor
                </Dropdown.Item>
              </DropdownButton>
            </td>
          )}

          {this.props.role !== 'Student' ? (
            <td>
              <h6>
                {this.props.student.firstname}, {this.props.student.lastname}
              </h6>
              {this.props.student.email}
            </td>
          ) : (
            <></>
          )}
          <td>{studentsAgent}</td>
          <td>{studentsEditor}</td>
          <td></td>
        </tr>
        {this.props.role === 'Admin' && (
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
        )}
      </>
    );
  }
}

export default StudentsAgentEditor;
