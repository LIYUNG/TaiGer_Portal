import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import EditAgentsSubpage from '../StudDocsOverview/EditAgentsSubpage';
import DEMO from '../../../../store/constant';

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
    if (
      this.props.student.agents === undefined ||
      this.props.student.agents.length === 0
    ) {
      return (
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
                    onClick={() => this.startEditingAgent(this.props.student)}
                  >
                    Edit Agent
                  </Dropdown.Item>
                </DropdownButton>
              </td>
            )}
            <td>
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  this.props.student._id,
                  DEMO.PROFILE
                )}`}
                className="text-info"
                style={{ textDecoration: 'none' }}
              >
                {this.props.student.firstname}
                {', '}
                {this.props.student.lastname}
              </Link>
            </td>
            <td>{this.props.student.email}</td>
            <td>
              {this.props.student.application_preference
                .expected_application_date || (
                <p className="text-danger">TBD</p>
              )}
            </td>
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
                submitUpdateAgentlist={this.submitUpdateAgentlist}
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

export default NoAgentsStudentsCard;
