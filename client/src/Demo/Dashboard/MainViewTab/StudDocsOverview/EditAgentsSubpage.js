import React from "react";
import { Table, Form, Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
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
                  this.props.student.agents
                    ? this.props.student.agents.findIndex(
                        (Agent) => Agent._id === agent._id
                      ) > -1
                      ? true
                      : false
                    : false
                }
                onChange={(e) => this.props.handleChangeAgentlist(e)}
                value={agent._id}
                id={"agent" + i + 1}
              />
            </Form.Group>
          </td>
          <td>
            <h5 className="my-0">
              {agent.lastname} {agent.firstname}
            </h5>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <h5 className="my-1"> No Agent</h5>
      </tr>
    );

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="l"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Agent for {this.props.student.firstname} -{" "}
            {this.props.student.lastname} to
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <tbody>{agentlist}</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(e) =>
              this.props.submitUpdateAgentlist(
                e,
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
