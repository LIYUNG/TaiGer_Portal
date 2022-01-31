import React from "react";
import {
  Row,
  Col,
  Form,
  Table,
  Button,
  Card,
  Collapse,
  Modal,
  Spinner,
} from "react-bootstrap";
import UcFirst from "../../App/components/UcFirst";
import { IoMdCloudUpload } from "react-icons/io";
import {
  AiOutlineDownload,
  AiOutlineFieldTime,
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineComment,
  AiOutlineDelete,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDash } from "react-icons/bs";
import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  getStudents,
  downloadProfile,
} from "../../api";

class ButtonSetNotNeeded extends React.Component {
  state = {
    student: this.props.student,
    student_id: "",
    category: "",
    docName: "",
    comments: "",
    file: "",
    isLoaded: this.props.isLoaded,
    SetNeededWindow: false,
  };

  openCommentWindow = (comments) => {
    console.log();
    this.setState((state) => ({
      ...state,
      SetNeededWindow: true,
      comments,
    }));
  };

  closeSetNeededWindow = () => {
    this.setState((state) => ({ ...state, SetNeededWindow: false }));
  };

  onDeleteFileWarningPopUp = (e, category, student_id, docName) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      category,
      docName,
      deleteFileWarningModel: true,
    }));
  };

  handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      feedback: rejectmessage,
    }));
  };

  onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      category,
      status,
      SetNeededWindow: true,
    }));
  };

  onDeleteFilefromstudent = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false,
    }));
    this.props.onDeleteFilefromstudent(
      this.state.category,
      this.state.student_id
    );
  };

  onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false,
    }));
    this.props.onUpdateProfileFilefromstudent(
      this.state.category,
      this.state.student_id,
      this.state.status,
      this.state.feedback
    );
  };
  render() {
    const deleteStyle = "danger";
    const graoutStyle = "light";
    var ButttonRow_NotNeeded;
    ButttonRow_NotNeeded = (
      <tr key={this.props.key + 1}>
        <th>
          <BsDash size={24} color="lightgray" title="Not needed" />
        </th>
        <td>
          {this.props.docName}
          {" - "}
          {this.props.date}
          {" - "}
          {this.props.time}
        </td>
        {this.props.role === "Editor" ? (
          <></>
        ) : (
          <>
            {this.props.role === "Student" ? (
              <></>
            ) : (
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.onUpdateProfileDocStatus(
                        e,
                        this.props.k,
                        this.props.student_id,
                        "missing"
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Set Needed
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
            )}
            <Form>
              <Form.File.Label
                onChange={(e) =>
                  this.handleGeneralDocSubmit(
                    e,
                    this.props.k,
                    this.props.student_id
                  )
                }
                onClick={(e) => (e.target.value = null)}
              >
                <Form.File.Input hidden />
                <IoMdCloudUpload size={32} />
              </Form.File.Label>
            </Form>
          </>
        )}
        <td></td>
      </tr>
    );

    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    return (
      <>
        {ButttonRow_NotNeeded}
        <Modal
          show={this.state.SetNeededWindow}
          onHide={this.closeSetNeededWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Comments
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to set {this.state.category} as mandatory document?
            {!this.state.isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!this.state.isLoaded}
              onClick={(e) => this.onUpdateProfileFilefromstudent(e)}
            >
              Ok
            </Button>
            <Button onClick={this.closeSetNeededWindow}>Ok</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ButtonSetNotNeeded;
