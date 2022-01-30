import React from "react";
import { Row, Col, Spinner, Button, Card, Modal, Form } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import EditFilesSubpage from "./EditFilesSubpage";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
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
class AgentCenter extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    data: null,
    success: false,
    students: [],
    file: "",
    student_id: "",
    status: "", //reject, accept... etc
    category: "",
    feedback: "",
    expand: false,
    deleteFileWarningModel: false,
    rejectProfileFileModel: false,
    // accordionKeys: new Array(-1, this.props.user.students.length), // To collapse all
    accordionKeys:
      this.props.user.role === "Editor" || this.props.user.role === "Agent"
        ? new Array(this.props.user.students.length).fill().map((x, i) => i)
        : [0], // to expand all]
  };

  componentDidMount() {
    console.log(this.props.user);
    getStudents().then(
      (resp) => {
        console.log(resp.data);
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            success: success,
            // accordionKeys: new Array(data.length).fill().map((x, i) => i), // to expand all
            accordionKeys: new Array(-1, data.length), // to collapse all
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(error);
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  }
  openWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: true }));
  };

  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
  };
  openRejectWarningWindow = () => {
    this.setState((state) => ({ ...state, rejectProfileFileModel: true }));
  };
  closeRejectWarningWindow = () => {
    this.setState((state) => ({ ...state, rejectProfileFileModel: false }));
  };
  singleExpandtHandler = (idx) => {
    let accordionKeys = [...this.state.accordionKeys];
    accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
    this.setState((state) => ({
      ...state,
      accordionKeys: accordionKeys,
    }));
  };

  AllCollapsetHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: false,
      accordionKeys:
        this.props.user.role === "Editor" || this.props.user.role === "Agent"
          ? new Array(this.props.user.students.length).fill().map((x, i) => -1)
          : [-1], // to expand all]
    }));
  };

  AllExpandtHandler = () => {
    this.setState((state) => ({
      ...state,
      expand: true,
      accordionKeys:
        this.props.user.role === "Editor" || this.props.user.role === "Agent"
          ? new Array(this.props.user.students.length).fill().map((x, i) => i)
          : [0], // to expand all]
    }));
  };

  onDeleteFileWarningPopUp = (e, category, student_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      category,
      deleteFileWarningModel: true,
    }));
  };

  handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    // console.log(e.target.value);
    this.setState((state) => ({
      ...state,
      feedback: rejectmessage,
    }));
  };
  onRejectProfileFilefromstudent = () => {
    let student_arrayidx = this.state.students.findIndex(
      (student) => student._id === this.state.student_id
    );
    let student = this.state.students.find(
      (student) => student._id === this.state.student_id
    );
    let idx = student.profile.findIndex(
      (doc) => doc.name === this.state.category
    );
    let students = [...this.state.students];
    this.setState((state) => ({
      ...state,
      isLoaded: false,
    }));
    console.log(students);
    updateProfileDocumentStatus(
      this.state.category,
      this.state.student_id,
      this.state.status,
      this.state.feedback
    ).then(
      (res) => {
        students[student_arrayidx] = res.data.data;
        const { data, success } = res.data;
        if (success) {
          // setTimeout will be remove in production
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                students: students,
                success,
                rejectProfileFileModel: false,
                isLoaded: true,
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(res.data.message);
        }
      },
      (error) => {}
    );
  };

  onDeleteFilefromstudent = () => {
    // e.preventDefault();
    let student_arrayidx = this.state.students.findIndex(
      (student) => student._id === this.state.student_id
    );
    let student = this.state.students.find(
      (student) => student._id === this.state.student_id
    );
    let idx = student.profile.findIndex(
      (doc) => doc.name === this.state.category
    );
    let students = [...this.state.students];
    this.setState((state) => ({
      ...state,
      isLoaded: false,
    }));
    deleteFile(this.state.category, this.state.student_id).then(
      (res) => {
        const { data, success } = res.data;
        students[student_arrayidx].profile[idx] = data;
        // std.profile[idx] = res.data.data; // res.data = {success: true, data:{...}}
        if (success) {
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                student_id: "",
                category: "",
                isLoaded: true,
                students: students,
                success: success,
                deleteFileWarningModel: false,
              }));
            }.bind(this),
            1500
          );
          // this.setState((state) => ({
          //   ...state,
          //   student_id: "",
          //   category: "",
          //   isLoaded: true,
          //   students: students,
          //   success: success,
          //   deleteFileWarningModel: false,
          // }));
        } else {
          alert(res.data.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  onDownloadFilefromstudent(e, category, id) {
    e.preventDefault();
    downloadProfile(category, id).then(
      (resp) => {
        console.log(resp.data);
        const actualFileName =
          resp.headers["content-disposition"].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split("."); //split file name
        filetype = filetype.pop(); //get the file type

        if (filetype === "pdf") {
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          //Open the URL on new Window
          window.open(url); //TODO: having a reasonable file name, pdf viewer
        } else {
          //if not pdf, download instead.

          const url = window.URL.createObjectURL(new Blob([blob]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", actualFileName);
          // Append to html link element page
          document.body.appendChild(link);
          // Start download
          link.click();
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        }
      },
      (error) => {
        alert("The file is not available.");
      }
    );
  }

  onFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };

  onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      category,
      status,
      rejectProfileFileModel: true,
    }));
  };

  handleGeneralDocSubmit = (e, studentId, fileCategory) => {
    e.preventDefault();
    this.SubmitGeneralFile(e, studentId, fileCategory);
  };
  SubmitGeneralFile = (e, studentId, fileCategory) => {
    this.onSubmitGeneralFile(e, e.target.files[0], studentId, fileCategory);
  };

  onSubmitGeneralFile = (e, NewFile, category, student_id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", NewFile);

    let student_arrayidx = this.state.students.findIndex(
      (student) => student._id === student_id
    );
    this.setState((state) => ({
      ...state,
      isLoaded: false,
    }));
    uploadforstudent(category, student_id, formData).then(
      (res) => {
        let students = [...this.state.students];
        const { data, success } = res.data;
        students[student_arrayidx] = data;
        console.log(students);

        if (success) {
          // setTimeout will be remove in production
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                students: students, // res.data = {success: true, data:{...}}
                success,
                category: "",
                isLoaded: true,
                file: "",
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(res.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  };

  render() {
    const { error, isLoaded } = this.state;
    let FILE_OK_SYMBOL = (
      <IoCheckmarkCircle size={18} color="limegreen" title="Valid Document" />
    );
    let FILE_NOT_OK_SYMBOL = (
      <AiFillCloseCircle size={18} color="red" title="Invalid Document" />
    );
    let FILE_UPLOADED_SYMBOL = (
      <AiOutlineFieldTime
        size={18}
        color="orange"
        title="Uploaded successfully"
      />
    );
    let FILE_MISSING_SYMBOL = (
      <AiFillQuestionCircle
        size={18}
        color="lightgray"
        title="No Document uploaded"
      />
    );
    let FILE_DONT_CARE_SYMBOL = (
      <BsDash size={18} color="lightgray" title="Not needed" />
    );
    let SYMBOL_EXPLANATION = (
      <>
        <p></p>
        <p>
          {FILE_OK_SYMBOL}: The document is valid and can be used in the
          application.
        </p>
        <p>
          {FILE_NOT_OK_SYMBOL}: The document is invalud and cannot be used in
          the application. Please properly scan a new one.
        </p>
        <p>
          {FILE_UPLOADED_SYMBOL}: The document is uploaded. Your agent will
          check it as soon as possible.
        </p>
        <p>{FILE_MISSING_SYMBOL}: Please upload the copy of the document.</p>
        <p>{FILE_DONT_CARE_SYMBOL}: This document is not needed.</p>
      </>
    );
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (!isLoaded) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    const student_profile = this.state.students.map((student, i) => (
      <EditFilesSubpage
        key={i}
        idx={i}
        student={student}
        accordionKeys={this.state.accordionKeys}
        singleExpandtHandler={this.singleExpandtHandler}
        role={this.props.user.role}
        startEditingProgram={this.props.startEditingProgram}
        documentslist2={this.props.documentslist2}
        documentlist2={window.documentlist2}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        onFileChange={this.onFileChange}
        onDeleteGeneralFile={this.onDeleteGeneralFile}
        onDownloadFilefromstudent={this.onDownloadFilefromstudent}
        onUpdateProfileDocStatus={this.onUpdateProfileDocStatus}
        onDeleteFileWarningPopUp={this.onDeleteFileWarningPopUp}
        SubmitGeneralFile={this.SubmitGeneralFile}
        handleGeneralDocSubmit={this.handleGeneralDocSubmit}
        SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
      />
    ));
    return (
      <Aux>
        <Row className="sticky-top ">
          <Card className="mt-0">
            <Card.Header>
              <Card.Title as="h5">
                <Row>
                  <Col>
                    <h3>Agent Center</h3>
                  </Col>
                  <Col md={{ span: 2, offset: 0 }}>
                    {this.state.expand ? (
                      <Button
                        className="btn-sm"
                        onClick={() => this.AllCollapsetHandler()}
                      >
                        Collaspse
                      </Button>
                    ) : (
                      <Button
                        className="btn-sm"
                        onClick={() => this.AllExpandtHandler()}
                      >
                        Expand
                      </Button>
                    )}
                  </Col>
                </Row>{" "}
                {!isLoaded && (
                  <div style={style}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden"></span>
                    </Spinner>
                  </div>
                )}
              </Card.Title>
            </Card.Header>
          </Card>
        </Row>
        <Row>
          <Col sm={12}>{student_profile}</Col>
        </Row>
        <Modal
          show={this.state.deleteFileWarningModel}
          onHide={this.closeWarningWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to delete {this.state.docName}?</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onDeleteFilefromstudent}>Yes</Button>
            <Button onClick={this.closeWarningWindow}>No</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.rejectProfileFileModel}
          onHide={this.closeRejectWarningWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="rejectmessage">
              <Form.Label>
                Please give a reason why the uploaded {this.state.category} is
                invalied?
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="ex. Poor scanned quality."
                defaultValue={""}
                onChange={(e) => this.handleRejectMessage(e, e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onRejectProfileFilefromstudent}>Yes</Button>
            <Button onClick={this.closeRejectWarningWindow}>No</Button>
          </Modal.Footer>
        </Modal>
      </Aux>
    );
  }
}

export default AgentCenter;
