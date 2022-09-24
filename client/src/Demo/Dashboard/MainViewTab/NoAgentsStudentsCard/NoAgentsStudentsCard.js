import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
// import avatar1 from "../../../assets/images/user/avatar-1.jpg";
import EditAgentsSubpage from '../StudDocsOverview/EditAgentsSubpage';
class NoAgentsStudentsCard extends React.Component {
  state = {
    showAgentPage: false
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

  submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    this.setAgentModalhide();
    this.props.submitUpdateAgentlist(e, updateAgentList, student_id);
  };

  render() {
    return (
      <>
        {this.props.student.agents.length === 0 && (
          <>
            <tr>
              {this.props.role === 'Admin' && !this.props.isArchivPage && (
                <td>
                  <DropdownButton
                    className="my-0 mx-0"
                    size="sm"
                    title="Option"
                    variant="primary"
                    id={`dropdown-variants-${this.props.student._id}`}
                    key={this.props.student._id}
                  >
                    <Dropdown.Item
                      eventKey="1"
                      onSelect={() =>
                        this.startEditingAgent(this.props.student)
                      }
                    >
                      Edit Agent
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
              </>
            )}
          </>
        )}
      </>
    );
  }
}

export default NoAgentsStudentsCard;
