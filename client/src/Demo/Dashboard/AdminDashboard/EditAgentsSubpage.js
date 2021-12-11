import React from "react";
// import { FaBeer } from 'react-icons/fa';
import { Table, Col, Form, Modal } from "react-bootstrap";
import {
  Button,
  // OverlayTrigger,
  // Tooltip,
  // ButtonToolbar,
  // SplitButton
} from "react-bootstrap";
class EditAgentsSubpage extends React.Component {
  // edit Agent subpage

  render() {
    let agentlist = this.props.agent_list ? (
      this.props.agent_list.map((agent, i) => (
        <tr key={i + 1}>
          <td>
            <Form.Group>
              <Form.Check
                custom
                type="checkbox"
                name="agent_id"
                defaultChecked={
                  this.props.student.agents.indexOf(agent._id) > -1
                    ? true
                    : false
                }
                onChange={(e) => this.props.handleChangeAgentlist(e)}
                value={agent._id}
                id={"agent" + i + 1}
              />
            </Form.Group>
          </td>
          <td>
            <h4 className="mb-1">
              {agent.lastname_} {agent.firstname_}{" "}
            </h4>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <h4 className="mb-1"> No Agent</h4>
      </tr>
    );

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
            Agent for {this.props.student.firstname_} -{" "}
            {this.props.student.lastname_} to
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <tbody>{agentlist}</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() =>
              this.props.submitUpdateAgentlist(
                this.props.updateAgentList,
                this.props.student._id
              )
            }
          >
            Update
          </Button>
          <Button onClick={this.props.setmodalhide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditAgentsSubpage;
