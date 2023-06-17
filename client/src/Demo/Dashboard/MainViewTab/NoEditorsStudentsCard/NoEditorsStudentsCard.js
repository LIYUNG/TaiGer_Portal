import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
import { is_TaiGer_role } from '../../../Utils/checking-functions';
import { Link } from 'react-router-dom';

class NoEditorsStudentsCard extends React.Component {
  state = {
    showEditorPage: false
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

  submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    this.setEditorModalhide();
    this.props.submitUpdateEditorlist(e, updateEditorList, student_id);
  };

  render() {
    if (
      this.props.student.editors === undefined ||
      this.props.student.editors.length === 0
    ) {
      return (
        <>
          <tr>
            {is_TaiGer_role(this.props.user) && !this.props.isArchivPage && (
              <td>
                <DropdownButton
                  size="sm"
                  title="Option"
                  variant="primary"
                  id={`dropdown-variants-${this.props.student._id}`}
                  key={this.props.student._id}
                >
                  <Dropdown.Item
                    eventKey="2"
                    onClick={() => this.startEditingEditor(this.props.student)}
                  >
                    Edit Editor
                  </Dropdown.Item>
                </DropdownButton>
              </td>
            )}
            <td>
              <Link
                className="text-info"
                to={`/student-database/${this.props.student._id.toString()}/profile`}
              >
                {this.props.student.firstname}, {this.props.student.lastname}
              </Link>
            </td>
            <td>{this.props.student.email}</td>
            <td>
              {this.props.student.application_preference
                .expected_application_date || (
                <p className="text-danger">TBD</p>
              )}
            </td>
            <td>
              {!this.props.student.agents ||
              this.props.student.agents.length === 0 ? (
                <p className="text-danger">
                  <b>No Agent</b>
                </p>
              ) : (
                this.props.student.agents.map(
                  (agent, i) => `${agent.firstname} ${agent.lastname} `
                )
              )}
            </td>
          </tr>
          {is_TaiGer_role(this.props.user) && (
            <>
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
    } else {
      return <></>;
    }
  }
}

export default NoEditorsStudentsCard;
