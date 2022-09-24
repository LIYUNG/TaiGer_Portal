import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import EditEditorsSubpage from '../StudDocsOverview/EditEditorsSubpage';
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
    return (
      <>
        {this.props.student.editors.length === 0 && (
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
                      eventKey="2"
                      onSelect={() =>
                        this.startEditingEditor(this.props.student)
                      }
                    >
                      Edit Editor
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
              )}
              <td>
                {this.props.student.firstname}, {this.props.student.lastname}
              </td>
              <td>{this.props.student.email}</td>
            </tr>
            {this.props.role === 'Admin' && (
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
        )}
      </>
    );
  }
}

export default NoEditorsStudentsCard;
