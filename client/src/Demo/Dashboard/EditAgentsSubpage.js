import React from "react";
// import { FaBeer } from 'react-icons/fa';
import { Col, Form, Modal } from "react-bootstrap";
import {
  Button,
  // OverlayTrigger,
  // Tooltip,
  // ButtonToolbar,
  // SplitButton
} from "react-bootstrap";
class EditAgentsSubpage extends React.Component {
  constructor(props) {
    super(props);
    this.setmodalhide = this.props.setmodalhide.bind(this);
    this.onDeleteProgram = this.props.onDeleteProgram.bind(this);
    this.onDeleteFilefromstudent =
      this.props.onDeleteFilefromstudent.bind(this);
    this.onDownloadFilefromstudent =
      this.props.onDownloadFilefromstudent.bind(this);
    this.onRejectFilefromstudent =
      this.props.onRejectFilefromstudent.bind(this);
    this.onAcceptFilefromstudent =
      this.props.onAcceptFilefromstudent.bind(this);
  }
  // edit Agent subpage
  render() {
    let agentlist = this.props.agent_list ? (
      this.props.agent_list.map((agent, i) => (
        <div key={i + 1}>
          <td>
            <Form.Group>
              <Form.Check
                custom
                type="checkbox"
                name="agent_id"
                defaultChecked={
                  this.props.students[this.props.student_i].agent_.indexOf(
                    agent.emailaddress_
                  ) > -1
                    ? true
                    : false
                }
                onChange={(e) => this.props.handleChangeAgentlist(e)}
                value={agent.emailaddress_}
                id={"agent" + i + 1}
              />
            </Form.Group>
          </td>
          <td>
            <h4 className="mb-1">
              {agent.lastname_} {agent.firstname_}{" "}
            </h4>
          </td>
        </div>
      ))
    ) : (
      <div>
        <h4 className="mb-1"> No Agent</h4>
      </div>
    );
    if (this.props.subpage === 1) {
      return (
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Agent for {this.props.students[this.props.student_i].firstname_} -{" "}
              {this.props.students[this.props.student_i].lastname_} to
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Agent:</h4>
            {agentlist}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() =>
                this.props.submitUpdateAgentlist(
                  this.props.updateAgentList,
                  this.props.students[this.props.student_i]._id
                )
              }
            >
              Update
            </Button>
            <Button onClick={this.setmodalhide}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      return (
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              {/* Uploaded files for {this.props.data[this.props.student_i].firstname_} - {this.props.data[this.props.student_i].lastname_} */}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>other:</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setmodalhide}>Assign</Button>
            <Button onClick={this.setmodalhide}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
}

export default EditAgentsSubpage;
