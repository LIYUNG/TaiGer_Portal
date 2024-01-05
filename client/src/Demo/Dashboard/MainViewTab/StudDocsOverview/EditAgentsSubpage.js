import React, { useEffect, useState } from 'react';
import { Table, Form, Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

function EditAgentsSubpage(props) {
  // edit Agent subpage
  const [checkboxState, setCheckboxState] = useState({});

  useEffect(() => {
    // Initialize the state with checked checkboxes based on the student's agents
    const initialCheckboxState = {};
    props.agent_list?.forEach((agent, i) => {
      initialCheckboxState[agent._id] = props.student.agents
        ? props.student.agents.some((a) => a._id === agent._id)
        : false;
    });
    setCheckboxState(initialCheckboxState);
  }, [props.agent_list, props.student.agents]);

  const handleChangeAgentlist = (e) => {
    const { value } = e.target;
    setCheckboxState((prevState) => ({
      ...prevState,
      [value]: !prevState[value]
    }));
  };

  let agentlist = props.agent_list ? (
    props.agent_list.map((agent, i) => (
      <tr key={i + 1}>
        <td>
          <Form>
            <Form.Check
              type="checkbox"
              checked={checkboxState[agent._id]}
              onChange={(e) => handleChangeAgentlist(e)}
              value={agent._id}
            />
          </Form>
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
      show={props.show}
      onHide={props.onHide}
      size="l"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Agent for {props.student.firstname} - {props.student.lastname} to
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table size="sm">
          <tbody>{agentlist}</tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={(e) =>
            props.submitUpdateAgentlist(e, checkboxState, props.student._id)
          }
        >
          Update
        </Button>
        <Button onClick={props.onHide} variant="light">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditAgentsSubpage;
