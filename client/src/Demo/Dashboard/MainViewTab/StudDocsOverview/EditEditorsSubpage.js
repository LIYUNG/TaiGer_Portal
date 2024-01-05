import React, { useEffect, useState } from 'react';
import { Table, Form, Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
function EditEditorsSubpage(props) {
  // edit Editor subpage
  const [checkboxState, setCheckboxState] = useState({});

  useEffect(() => {
    // Initialize the state with checked checkboxes based on the student's agents
    const initialCheckboxState = {};
    props.editor_list?.forEach((editor, i) => {
      initialCheckboxState[editor._id] = props.student.editors
        ? props.student.editors.some((a) => a._id === editor._id)
        : false;
    });
    setCheckboxState(initialCheckboxState);
  }, [props.editor_list, props.student.editors]);

  const handleChangeEditorlist = (e) => {
    const { value } = e.target;
    setCheckboxState((prevState) => ({
      ...prevState,
      [value]: !prevState[value]
    }));
  };

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
          Editor for {props.student.firstname} - {props.student.lastname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Editor:</h4>
        <Table size="sm">
          <tbody>
            {props.editor_list ? (
              props.editor_list.map((editor, i) => (
                <tr key={i + 1}>
                  <th>
                    <Form.Group>
                      <Form.Check
                        custom
                        type="checkbox"
                        name="student_id"
                        defaultChecked={
                          props.student.editors
                            ? props.student.editors.some(
                                (e) => e._id === editor._id
                              )
                            : false
                        }
                        onChange={(e) => handleChangeEditorlist(e)}
                        value={editor._id}
                        id={'editor' + i + 1}
                      />
                    </Form.Group>
                  </th>
                  <td>
                    <h5 className="my-0">
                      {editor.firstname} {editor.lastname}
                    </h5>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  <h5 className="my-0"> No Editor</h5>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={(e) =>
            props.submitUpdateEditorlist(e, checkboxState, props.student._id)
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
export default EditEditorsSubpage;
