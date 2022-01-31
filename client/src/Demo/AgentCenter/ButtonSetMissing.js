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

class ButtonSetMissing extends React.Component {
  state = {
    student: this.props.student,
    student_id: "",
    category: "",
    docName: "",
    comments: "",
    file: "",
    isLoaded: this.props.isLoaded,
    deleteFileWarningModel: false,
    CommentModel: false,
    setMissingWindow: false,
    acceptProfileFileModel: false,
  };

  opensetMissingWindow = () => {
    this.setState((state) => ({ ...state, setMissingWindow: true }));
  };

  closeSetMissingWindow = () => {
    this.setState((state) => ({ ...state, setMissingWindow: false }));
  };

  onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      category,
      status,
      setMissingWindow: true,
    }));
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
    var ButttonRow_Rejected;
    ButttonRow_Rejected = (
      <tr key={this.props.key + 1}>
        <th>
          <AiFillQuestionCircle
            size={24}
            color="lightgray"
            title="No Document uploaded"
          />
        </th>
        <td>{this.props.docName}</td>
        {this.props.role === "Editor" ? (
          <></>
        ) : (
          <>
            <td>
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
            </td>
            {this.props.role === "Student" ? (
              <></>
            ) : (
              <td>
                <Col md>
                  <Form
                    onSubmit={(e) =>
                      this.onUpdateProfileDocStatus(
                        e,
                        this.props.k,
                        this.props.student_id,
                        "notneeded"
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button variant={"secondary"} size="sm" type="submit">
                        Set notneeded
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
            )}
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
        {ButttonRow_Rejected}
        <Modal
          show={this.state.setMissingWindow}
          onHide={this.closeSetMissingWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to set {this.state.category} unnecessary document?
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
              Yes
            </Button>
            <Button onClick={this.closeSetMissingWindow}>No</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ButtonSetMissing;
