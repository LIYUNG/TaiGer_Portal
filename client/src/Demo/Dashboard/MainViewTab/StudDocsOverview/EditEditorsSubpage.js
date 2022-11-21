import React from "react";
import { Table, Form, Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
class EditEditorsSubpage extends React.Component {
  // edit Editor subpage
  render() {
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
            Editor for {this.props.student.firstname} -{" "}
            {this.props.student.lastname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Editor:</h4>
          <Table>
            <tbody>
              {this.props.editor_list ? (
                this.props.editor_list.map((editor, i) => (
                  <tr key={i + 1}>
                    <th>
                      <Form.Group>
                        <Form.Check
                          custom
                          type="checkbox"
                          name="student_id"
                          defaultChecked={
                            this.props.student.editors
                              ? this.props.student.editors.findIndex(
                                  (Editor) => Editor._id === editor._id
                                ) > -1
                                ? true
                                : false
                              : false
                          }
                          onChange={(e) => this.props.handleChangeEditorlist(e)}
                          value={editor._id}
                          id={"editor" + i + 1}
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
              this.props.submitUpdateEditorlist(
                e,
                this.props.updateEditorList,
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
export default EditEditorsSubpage;
