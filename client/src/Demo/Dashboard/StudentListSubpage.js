import React from "react";
// import { FaBeer } from 'react-icons/fa';
import {
  AiFillCheckCircle,
  AiOutlineLoading3Quarters,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineStop,
} from "react-icons/ai";
import { Row, Col, Table, Form, Modal } from "react-bootstrap";
import {
  Button,
  // OverlayTrigger,
  // Tooltip,
  // ButtonToolbar,
  Dropdown,
  DropdownButton,
  // SplitButton
} from "react-bootstrap";
import { getMaxListeners } from "process";

class StudentListSubpage extends React.Component {
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
  //   componentDidUpdate() {
  //     if (this.props.show) {
  //       var tempAgentList = {};
  //       this.props.agent_list.map((agent, i) => {
  //         if (
  //           this.props.students[this.props.student_i].agent_.indexOf(
  //             agent.emailaddress_
  //           ) > -1
  //         ) {
  //           console.log("true");
  //           tempAgentList[agent.emailaddress_] = true;
  //         } else {
  //           console.log("false");
  //           tempAgentList[agent.emailaddress_] = false;
  //         }
  //       });
  //       console.log("default tempAgentList " + JSON.stringify(tempAgentList));
  //       this.state.updateAgentList = tempAgentList;
  //     }
  //   }

  //   componentDidMount() {
  //     if (this.props.show) {
  //       var tempAgentList = {};
  //       this.props.agent_list.map((agent, i) => {
  //         if (
  //           this.props.students[this.props.student_i].agent_.indexOf(
  //             agent.emailaddress_
  //           ) > -1
  //         ) {
  //           console.log("true");
  //           tempAgentList[agent.emailaddress_] = true;
  //         } else {
  //           console.log("false");
  //           tempAgentList[agent.emailaddress_] = false;
  //         }
  //       });
  //       console.log("default tempAgentList " + JSON.stringify(tempAgentList));
  //       this.state.updateAgentList = tempAgentList;
  //     }
  //   }

  //   handleInitAgentChecked = () => {
  //     console.log(this.state.updateAgentList);

  //     // this.setState({
  //     //   updateAgentList: "a",
  //     // });

  //     // this.setState((prevState) => ({
  //     //   updateAgentList: {
  //     //     ...prevState.updateAgentList,
  //     //     this.props.agent_list.map((agent, i) =>
  //     //   [agent.emailaddress_]: (this.props.students[this.props.student_i].agent_.indexOf(
  //     //     agent.emailaddress_
  //     //   ) > -1
  //     //     ? true
  //     //     : false
  //     // ))
  //     //     // [value]: defaultChecked,
  //     //   },
  //     // }));
  //   };

//   handleSubmitUpdateAgentlist = (updateAgentList) => {
//     this.props.submitUpdateAgentlist(updateAgentList);
//   };

  render() {
    if (this.props.subpage === 1) {
      // edit Agent subpage

      // console.log("agent list : " + this.props.agent_list);
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
    } else if (this.props.subpage === 2) {
      // edit Editor subpage
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
              Editor for {this.props.students[this.props.student_i].firstname_}{" "}
              - {this.props.students[this.props.student_i].lastname_}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Editor:</h4>
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
                          this.props.students[
                            this.props.student_i
                          ].editor_.indexOf(editor.emailaddress_) > -1
                            ? true
                            : false
                        }
                        onChange={(e) => this.props.handleChangeEditorlist(e)}
                        value={editor.emailaddress_}
                        id={"editor" + i + 1}
                      />
                    </Form.Group>
                  </th>
                  <td>
                    <h4 className="mb-1">
                      {editor.firstname_} {editor.lastname_}
                    </h4>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  <h4 className="mb-1"> No Editor</h4>
                </td>
              </tr>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() =>
                this.props.submitUpdateEditorlist(
                  this.props.updateEditorList,
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
    } else if (this.props.subpage === 3) {
      // Edit Program
      let programstatus;
      if (this.props.students[this.props.student_i].applying_program_) {
        programstatus = this.props.students[
          this.props.student_i
        ].applying_program_.map((program, i) => (
          <tr key={i}>
            <Form.Group>
              <Form.Check
                custom
                type="checkbox"
                name="student_id"
                value={i}
                id={i + 1}
              />
            </Form.Group>
            <td>
              <h4 className="mb-1">
                {program.University_}, {program.Program_}
              </h4>
            </td>
            <td>
              <Col md={2}>
                <Form
                  onSubmit={(e) =>
                    this.onDeleteProgram(
                      e,
                      this.props.students[this.props.student_i]._id,
                      program._id
                    )
                  }
                >
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <div className="form-group">
                      <button type="submit">Delete</button>
                    </div>
                  </Form.Group>
                </Form>
              </Col>
            </td>
          </tr>
        ));
      } else {
        programstatus = (
          <tr>
            <td>
              <h4 className="mb-1"> No Program</h4>
            </td>
          </tr>
        );
      }
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
              Program for {this.props.students[this.props.student_i].firstname_}{" "}
              - {this.props.students[this.props.student_i].lastname_}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Program:</h4>
            <table>
              <tbody>{programstatus}</tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setmodalhide}>Assign</Button>
            <Button onClick={this.setmodalhide}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      );
    } else if (this.props.subpage === 4) {
      let documentlist;
      if (this.props.students[this.props.student_i].uploadedDocs_) {
        documentlist = this.props.documentslist.map((doc, i) => {
          if (
            this.props.students[this.props.student_i].uploadedDocs_[doc.prop] &&
            this.props.students[this.props.student_i].uploadedDocs_[doc.prop]
              .uploadStatus_ === "uploaded"
          ) {
            return (
              <tr key={i + 1}>
                <th>
                  <Form.Group>
                    <Form.Check
                      custom
                      type="checkbox"
                      name={doc.name}
                      defaultChecked={true}
                      id={i + 1}
                    />
                  </Form.Group>
                </th>
                <td>
                  <p className="m-0">
                    {" "}
                    {doc.name} :{" "}
                    {
                      this.props.students[this.props.student_i].uploadedDocs_[
                        doc.prop
                      ].uploadStatus_
                    }
                  </p>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onDownloadFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Download</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onRejectFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Reject</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onAcceptFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Accept</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onDeleteFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Delete</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <p className="m-0">
                    {" "}
                    {
                      this.props.students[this.props.student_i].uploadedDocs_[
                        doc.prop
                      ].LastUploadDate_
                    }
                  </p>
                </td>
              </tr>
            );
          } else if (
            this.props.students[this.props.student_i].uploadedDocs_[doc.prop] &&
            this.props.students[this.props.student_i].uploadedDocs_[doc.prop]
              .uploadStatus_ === "checked"
          ) {
            return (
              <tr key={i + 1}>
                <th>
                  <Form.Group>
                    <Form.Check
                      custom
                      type="checkbox"
                      name={doc.name}
                      defaultChecked={true}
                      id={i + 1}
                    />
                  </Form.Group>
                </th>
                <td>
                  <p className="m-0">
                    {" "}
                    {doc.name} :{" "}
                    {
                      this.props.students[this.props.student_i].uploadedDocs_[
                        doc.prop
                      ].uploadStatus_
                    }
                  </p>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onDownloadFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Download</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onRejectFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Reject</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onAcceptFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Accept</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onDeleteFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Delete</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <p className="m-0">
                    {" "}
                    {
                      this.props.students[this.props.student_i].uploadedDocs_[
                        doc.prop
                      ].LastUploadDate_
                    }
                  </p>
                </td>
              </tr>
            );
          } else if (
            this.props.students[this.props.student_i].uploadedDocs_[doc.prop] &&
            this.props.students[this.props.student_i].uploadedDocs_[doc.prop]
              .uploadStatus_ === "unaccepted"
          ) {
            return (
              <tr key={i + 1}>
                <th>
                  <Form.Group>
                    <Form.Check
                      custom
                      type="checkbox"
                      name={doc.name}
                      defaultChecked={true}
                      id={i + 1}
                    />
                  </Form.Group>
                </th>
                <td>
                  <p className="m-0">
                    {" "}
                    {doc.name} :{" "}
                    {
                      this.props.students[this.props.student_i].uploadedDocs_[
                        doc.prop
                      ].uploadStatus_
                    }
                  </p>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onDownloadFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Download</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onRejectFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Reject</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onAcceptFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Accept</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <Col md={2}>
                    <Form
                      onSubmit={(e) =>
                        this.onDeleteFilefromstudent(
                          e,
                          doc.prop,
                          this.props.students[this.props.student_i]._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <div className="form-group">
                          <button type="submit">Delete</button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td>
                  <p className="m-0">
                    {" "}
                    {
                      this.props.students[this.props.student_i].uploadedDocs_[
                        doc.prop
                      ].LastUploadDate_
                    }
                  </p>
                </td>
              </tr>
            );
          } else {
            return (
              <tr key={i + 1}>
                <th>
                  <div>
                    <Form.Group>
                      <Form.Check
                        custom
                        type="checkbox"
                        name={doc.name}
                        defaultChecked={false}
                        // value='value'
                        id={i + 1}
                      />
                    </Form.Group>
                  </div>
                </th>
                <td>
                  <p className="m-0">
                    <b> {doc.name} </b>
                  </p>
                </td>
              </tr>
            );
          }
        });
      } else {
        documentlist = <p>So far no selected program!</p>;
      }

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
              Uploaded files for{" "}
              {this.props.students[this.props.student_i].firstname_} -{" "}
              {this.props.students[this.props.student_i].lastname_}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Files:</h4>
            {documentlist}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.setmodalhide}>Close</Button>
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

export default StudentListSubpage;
