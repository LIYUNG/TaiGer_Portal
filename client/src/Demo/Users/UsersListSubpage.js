import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

function UsersListSubpage(props) {
  let user_roles = ['Guest', 'Student', 'Editor', 'Agent'];
  return (
    <Modal
      show={props.show}
      onHide={props.setModalHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Assign {props.firstname} - {props.lastname} as
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table>
          <tbody>
            {user_roles.map((role, i) => (
              <tr key={i + 1}>
                <th>
                  <Form.Group>
                    <Form.Check
                      custom
                      type="radio"
                      name="user_role"
                      defaultChecked={
                        props.selected_user_role === role ? true : false
                      }
                      id={role}
                      value={role}
                      onChange={props.handleChange2}
                    />
                  </Form.Group>
                </th>
                <td>
                  <h4 className="mb-1">{role}</h4>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => props.onSubmit2(e)}>Assign</Button>
        <Button onClick={props.setModalHide} variant="light">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default UsersListSubpage;
