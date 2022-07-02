import React, { useState } from "react";
import DEMO from "../../store/constant";
import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import DraftEditor from "./DraftEditor";
import DraftEditor_StudentFeeback from "./DraftEditor_StudentFeeback";

// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import {
  Row,
  Col,
  Button,
  Card,
  Collapse,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import {
  deleteProgramSpecificFileUpload,
  deleteGenralFileThread,
  SetAsFinalProgramSpecificFile,
  SetAsFinalGenralFile,
  uploadHandwrittenFileforstudent,
  uploadEditGeneralFileforstudent,
  updateHandwrittenFileCommentsforstudent,
  updateStudentFeedbackGeneralFileByStudent,
  updateStudentFeedbackProgramSpecificFileByStudent,
  updateEditGeneralFileCommentsforstudent,
  downloadHandWrittenFile,
  downloadGeneralHandWrittenFile,
  initGeneralMessageThread,
  initApplicationMessageThread,
  SubmitMessageWithAttachment,
} from "../../api";
import ManualFiles from "./ManualFiles";
import {
  AiOutlineDownload,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineMore,
  AiOutlineUndo,
  AiFillMessage,
} from "react-icons/ai";
class EditorDocsProgress extends React.Component {
  state = {
    student: this.props.student,
    deleteFileWarningModel: false,
    SetAsFinalFileModel: false,
    UndoFinalFileModel: false,
    CommentsModel: false,
    StudentFeedbackModel: false,
    ML_Requirements_Modal: false,
    studentId: "",
    doc_thread_id: "",
    applicationId: "",
    docName: "",
    whoupdate: "",
    comments: "",
    updatedAt: "",
    student_feedback: "",
    student_feedback_updatedAt: "",
    isLoaded: false,
    ml_requirements: "",
    file: "",
  };
  componentDidMount() {
    this.setState((state) => ({
      isLoaded: true,
    }));
  }
  openStudentFeebackProgramSpecificFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      StudentFeedbackModel: true,
    }));
  };
  closeStudentFeebackProgramSpecificFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      StudentFeedbackModel: false,
    }));
  };
  openSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: true,
    }));
  };
  closeSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: false,
    }));
  };
  openUndoFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      UndoFinalFileModel: true,
    }));
  };
  closeUndoFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      UndoFinalFileModel: false,
    }));
  };
  openML_Requirements_ModalWindow = (ml_requirements) => {
    this.setState((state) => ({
      ...state,
      ML_Requirements_Modal: true,
      ml_requirements,
    }));
  };
  closeML_Requirements_ModalWindow = () => {
    this.setState((state) => ({
      ...state,
      ML_Requirements_Modal: false,
      ml_requirements: "",
    }));
  };
  openWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: true }));
  };
  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
  };
  openCommentsWindow = () => {
    this.setState((state) => ({ ...state, CommentsModel: false }));
  };
  closeCommentsWindow = () => {
    this.setState((state) => ({ ...state, CommentsModel: false }));
  };
  ConfirmStudentFeedbackGeneralFileHandler = (student_feedback) => {
    this.setState((state) => ({
      ...state,
      isLoaded: false, //false to reload everything
    }));
    updateStudentFeedbackGeneralFileByStudent(
      this.state.studentId,
      this.state.docName,
      this.state.whoupdate,
      student_feedback
    ).then(
      (resp) => {
        console.log(resp.data.data);
        const { data, success } = resp.data;
        if (success) {
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                studentId: "",
                applicationId: "",
                docName: "",
                whoupdate: "",
                isLoaded: true,
                student: data,
                success: success,
                StudentFeedbackModel: false,
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(resp.data.message);
          this.setState((state) => ({
            ...state,
            studentId: "",
            applicationId: "",
            docName: "",
            whoupdate: "",
            isLoaded: true,
            success: success,
            StudentFeedbackModel: false,
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
  ConfirmStudentFeedbackProgramSpecificFileHandler = (student_feedback) => {
    this.setState((state) => ({
      ...state,
      isLoaded: false, //false to reload everything
    }));
    updateStudentFeedbackProgramSpecificFileByStudent(
      this.state.studentId,
      this.state.applicationId,
      this.state.docName,
      this.state.whoupdate,
      student_feedback
    ).then(
      (resp) => {
        console.log(resp.data.data);
        const { data, success } = resp.data;
        if (success) {
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                studentId: "",
                applicationId: "",
                docName: "",
                whoupdate: "",
                isLoaded: true,
                student: data,
                success: success,
                StudentFeedbackModel: false,
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(resp.data.message);
          this.setState((state) => ({
            ...state,
            studentId: "",
            applicationId: "",
            docName: "",
            whoupdate: "",
            isLoaded: true,
            success: success,
            StudentFeedbackModel: false,
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  ConfirmCommentsProgramSpecificFileHandler = (comments) => {
    this.setState((state) => ({
      ...state,
      isLoaded: false, //false to reload everything
    }));
    updateHandwrittenFileCommentsforstudent(
      this.state.studentId,
      this.state.applicationId,
      this.state.docName,
      this.state.whoupdate,
      comments
    ).then(
      (resp) => {
        console.log(resp.data.data);
        const { data, success } = resp.data;
        if (success) {
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                studentId: "",
                applicationId: "",
                docName: "",
                whoupdate: "",
                isLoaded: true,
                student: data,
                success: success,
                CommentsModel: false,
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(resp.data.message);
          this.setState((state) => ({
            ...state,
            studentId: "",
            applicationId: "",
            docName: "",
            whoupdate: "",
            isLoaded: true,
            success: success,
            CommentsModel: false,
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  ConfirmDeleteGeneralFileThreadHandler = () => {
    this.setState((state) => ({
      ...state,
      isLoaded: false, //false to reload everything
    }));
    deleteGenralFileThread(
      this.state.doc_thread_id,
      this.state.student_id
    ).then(
      (resp) => {
        console.log(resp.data.data);
        const { data, success } = resp.data;
        if (success) {
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                studentId: "",
                applicationId: "",
                docName: "",
                whoupdate: "",
                isLoaded: true,
                student: data,
                success: success,
                deleteFileWarningModel: false,
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(resp.data.message);
          this.setState((state) => ({
            ...state,
            studentId: "",
            applicationId: "",
            docName: "",
            whoupdate: "",
            isLoaded: true,
            success: success,
            deleteFileWarningModel: false,
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  ConfirmSetAsFinalSpecificFileHandler = () => {
    this.setState((state) => ({
      ...state,
      isLoaded: false, //false to reload everything
    }));
    SetAsFinalProgramSpecificFile(
      this.state.studentId,
      this.state.applicationId,
      this.state.docName,
      this.state.whoupdate
    ).then(
      (resp) => {
        console.log(resp.data.data);
        const { data, success } = resp.data;
        if (success) {
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                studentId: "",
                applicationId: "",
                docName: "",
                whoupdate: "",
                isLoaded: true,
                student: data,
                success: success,
                SetAsFinalFileModel: false,
                UndoFinalFileModel: false,
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(resp.data.message);
          this.setState((state) => ({
            ...state,
            studentId: "",
            applicationId: "",
            docName: "",
            whoupdate: "",
            isLoaded: true,
            success: success,
            SetAsFinalFileModel: false,
            UndoFinalFileModel: false,
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  ConfirmSetAsFinalGeneralFileHandler = () => {
    this.setState((state) => ({
      ...state,
      isLoaded: false, //false to reload everything
    }));
    SetAsFinalGenralFile(
      this.state.studentId,
      this.state.docName,
      this.state.whoupdate
    ).then(
      (resp) => {
        console.log(resp.data.data);
        const { data, success } = resp.data;
        if (success) {
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                studentId: "",
                applicationId: "",
                docName: "",
                whoupdate: "",
                isLoaded: true,
                student: data,
                success: success,
                SetAsFinalFileModel: false,
                UndoFinalFileModel: false,
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(resp.data.message);
          this.setState((state) => ({
            ...state,
            studentId: "",
            applicationId: "",
            docName: "",
            whoupdate: "",
            isLoaded: true,
            success: success,
            SetAsFinalFileModel: false,
            UndoFinalFileModel: false,
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
  ConfirmCommentsGeneralFileHandler = (comments) => {
    this.setState((state) => ({
      ...state,
      isLoaded: false, //false to reload everything
    }));
    updateEditGeneralFileCommentsforstudent(
      this.state.studentId,
      this.state.docName,
      this.state.whoupdate,
      comments
    ).then(
      (resp) => {
        console.log(resp.data.data);
        const { data, success } = resp.data;
        if (success) {
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                studentId: "",
                applicationId: "",
                docName: "",
                whoupdate: "",
                isLoaded: true,
                student: data,
                success: success,
                CommentsModel: false,
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(resp.data.message);
          this.setState((state) => ({
            ...state,
            studentId: "",
            applicationId: "",
            docName: "",
            whoupdate: "",
            isLoaded: true,
            success: success,
            CommentsModel: false,
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  onCommentsGeneralFile = (
    studentId,
    docName,
    whoupdate,
    feedback,
    updatedAt
  ) => {
    this.setState((state) => ({
      ...state,
      studentId,
      docName,
      whoupdate,
      filetype: "General",
      comments: feedback,
      updatedAt,
      CommentsModel: true,
    }));
  };
  onCommentsProgramSpecific = (
    studentId,
    applicationId,
    docName,
    whoupdate,
    feedback,
    updatedAt
  ) => {
    this.setState((state) => ({
      ...state,
      studentId,
      applicationId,
      docName,
      whoupdate,
      filetype: "ProgramSpecific",
      comments: feedback,
      updatedAt,
      CommentsModel: true,
    }));
  };

  onStudentFeedbackGeneral = (
    studentId,
    docName,
    whoupdate,
    student_feedback,
    student_feedback_updatedAt
  ) => {
    this.setState((state) => ({
      ...state,
      studentId,
      docName,
      whoupdate,
      filetype: "General",
      student_feedback,
      student_feedback_updatedAt,
      StudentFeedbackModel: true,
    }));
  };

  onStudentFeedbackProgramSpecific = (
    studentId,
    applicationId,
    docName,
    whoupdate,
    student_feedback,
    student_feedback_updatedAt
  ) => {
    this.setState((state) => ({
      ...state,
      studentId,
      applicationId,
      docName,
      whoupdate,
      filetype: "ProgramSpecific",
      student_feedback,
      student_feedback_updatedAt,
      StudentFeedbackModel: true,
    }));
  };
  handleAsFinalProgramSpecific = (
    studentId,
    applicationId,
    docName,
    whoupdate,
    action
  ) => {
    if (action === "setfinal") {
      this.setState((state) => ({
        ...state,
        studentId,
        applicationId,
        docName,
        whoupdate,
        filetype: "ProgramSpecific",
        SetAsFinalFileModel: true, //change
      }));
    } else if (action === "undofinal") {
      this.setState((state) => ({
        ...state,
        studentId,
        applicationId,
        docName,
        whoupdate,
        filetype: "ProgramSpecific",
        UndoFinalFileModel: true, //change
      }));
    }
  };

  handleAsFinalGeneralFile = (studentId, docName, whoupdate, action) => {
    if (action === "setfinal") {
      this.setState((state) => ({
        ...state,
        studentId,
        docName,
        whoupdate,
        filetype: "General",
        SetAsFinalFileModel: true,
      }));
    } else if (action === "undofinal") {
      this.setState((state) => ({
        ...state,
        studentId,
        docName,
        whoupdate,
        filetype: "General",
        UndoFinalFileModel: true,
      }));
    }
  };

  onDeleteGeneralFileThread = (doc_thread_id, studentId) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      student_id: studentId,
      deleteFileWarningModel: true,
    }));
  };
  onDeleteProgramSpecificThread = (doc_thread_id) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      deleteFileWarningModel: true,
    }));
  };

  onSubmitProgramSpecificFile = (
    e,
    NewFile,
    studentId,
    applicationId,
    fileCategory
  ) => {
    if (NewFile === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", NewFile);
      this.setState((state) => ({
        ...state,
        isLoaded: false, //false to reload everything
      }));
      uploadHandwrittenFileforstudent(
        studentId,
        applicationId,
        fileCategory,
        formData
      )
        .then((res) => {
          console.log(res.data);
          const { data, success } = res.data;
          if (success) {
            setTimeout(
              function () {
                //Start the timer
                this.setState({
                  isLoaded: true, //false to reload everything
                  student: data,
                  success: success,
                  file: "",
                });
              }.bind(this),
              1500
            );
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onSubmitGeneralFile = (e, NewFile, studentId, fileCategory) => {
    if (NewFile === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", NewFile);
      this.setState((state) => ({
        ...state,
        isLoaded: false, //false to reload everything
      }));
      uploadEditGeneralFileforstudent(studentId, fileCategory, formData)
        .then((res) => {
          console.log(res.data);
          const { data, success } = res.data;
          if (success) {
            setTimeout(
              function () {
                //Start the timer
                this.setState({
                  isLoaded: true, //false to reload everything
                  student: data,
                  success: success,
                  file: "",
                });
              }.bind(this),
              1500
            );
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  SubmitProgramSpecificFile = (e, studentId, applicationId, fileCategory) => {
    this.onSubmitProgramSpecificFile(
      e,
      e.target.files[0],
      studentId,
      applicationId,
      fileCategory
    );
  };

  SubmitGeneralFile = (e, studentId, fileCategory) => {
    this.onSubmitGeneralFile(e, e.target.files[0], studentId, fileCategory);
  };

  initProgramSpecificFileThread = (
    e,
    studentId,
    applicationId,
    document_catgory
  ) => {
    if ("1" === "") {
      e.preventDefault();
      alert("Please select file group");
    } else {
      e.preventDefault();
      initApplicationMessageThread(studentId, applicationId, document_catgory)
        .then((res) => {
          console.log(res.data);
          const { data, success } = res.data;
          if (success) {
            setTimeout(
              function () {
                //Start the timer
                this.setState({
                  isLoaded: true, //false to reload everything
                  // student: data,
                  success: success,
                  file: "",
                });
              }.bind(this),
              1500
            );
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  initGeneralFileThread = (e, studentId, document_catgory) => {
    if ("1" === "") {
      e.preventDefault();
      alert("Please select file group");
    } else {
      e.preventDefault();
      initGeneralMessageThread(studentId, document_catgory)
        .then((res) => {
          console.log(res.data);
          const { data, success } = res.data;
          if (success) {
            setTimeout(
              function () {
                //Start the timer
                this.setState({
                  isLoaded: true, //false to reload everything
                  student: data,
                  success: success,
                  file: "",
                });
              }.bind(this),
              1500
            );
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onDownloadProgramSpecificFile = (
    e,
    studentId,
    applicationId,
    docName,
    student_inputs
  ) => {
    e.preventDefault();
    downloadHandWrittenFile(studentId, applicationId, docName, student_inputs)
      .then((resp) => {
        console.log(resp);
        const { status } = resp;
        if (status === 200) {
          const actualFileName =
            resp.headers["content-disposition"].split('"')[1];
          const { data: blob } = resp;
          if (blob.size === 0) return;

          var filetype = actualFileName.split("."); //split file name
          filetype = filetype.pop(); //get the file type

          if (filetype === "pdf") {
            console.log(blob);
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: "application/pdf" })
            );

            //Open the URL on new Window
            console.log(url);
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
        } else {
          alert("resp.data.message");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  onDownloadGeneralFile = (e, studentId, docName, student_inputs) => {
    e.preventDefault();
    downloadGeneralHandWrittenFile(studentId, docName, student_inputs)
      .then((resp) => {
        console.log(resp);
        const { status } = resp;
        if (status === 200) {
          const actualFileName =
            resp.headers["content-disposition"].split('"')[1];
          const { data: blob } = resp;
          if (blob.size === 0) return;

          var filetype = actualFileName.split("."); //split file name
          filetype = filetype.pop(); //get the file type

          if (filetype === "pdf") {
            console.log(blob);
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: "application/pdf" })
            );

            //Open the URL on new Window
            console.log(url);
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
        } else {
          alert("resp.data.message");
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    if (!isLoaded && !this.state.student) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <>
        <Card className="mt-2" key={this.props.idx}>
          <Card.Header
            onClick={() => this.props.singleExpandtHandler(this.props.idx)}
          >
            <Card.Title
              as="h5"
              aria-controls={"accordion" + this.props.idx}
              aria-expanded={
                this.props.accordionKeys[this.props.idx] === this.props.idx
              }
            >
              {this.state.student.firstname}
              {" ,"}
              {this.state.student.lastname}
            </Card.Title>
          </Card.Header>
          <Collapse
            in={this.props.accordionKeys[this.props.idx] === this.props.idx}
          >
            <div id="accordion1">
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <h5>General Documents (CV, Recommendation Letters)</h5>
                  </Col>
                </Row>
                <ManualFiles
                  onDeleteGeneralFileThread={this.onDeleteGeneralFileThread}
                  onDeleteProgramSpecificThread={
                    this.onDeleteProgramSpecificThread
                  }
                  onDownloadGeneralFile={this.onDownloadGeneralFile}
                  onCommentsGeneralFile={this.onCommentsGeneralFile}
                  onStudentFeedbackGeneral={this.onStudentFeedbackGeneral}
                  SubmitGeneralFile={this.SubmitGeneralFile}
                  handleAsFinalGeneralFile={this.handleAsFinalGeneralFile}
                  role={this.props.role}
                  student={this.state.student}
                  filetype={"General"}
                  initGeneralFileThread={this.initGeneralFileThread}
                  initProgramSpecificFileThread={
                    this.initProgramSpecificFileThread
                  }
                />
                {this.state.student.applications.map((application, i) => (
                  <>
                    {application.decided !== undefined &&
                    application.decided === true ? (
                      <>
                        <Row>
                          <Col md={3}>
                            <h5>
                              {application.programId.school}
                              {" - "}
                              {application.programId.program_name}
                            </h5>
                          </Col>
                          <Col md={3}>
                            {application.programId.ml_requirements !==
                              undefined &&
                            application.programId.ml_requirements !== "" ? (
                              <>
                                ML Req.: {"           "}{" "}
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="light"
                                  onClick={() =>
                                    this.openML_Requirements_ModalWindow(
                                      application.programId.ml_requirements
                                    )
                                  }
                                >
                                  <AiOutlineMore size={20} />
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}{" "}
                            {application.programId.essay_requirements !==
                              undefined &&
                            application.programId.essay_requirements !== "" ? (
                              <>
                                Essay Req.: {"           "}{" "}
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="light"
                                  onClick={() =>
                                    this.openML_Requirements_ModalWindow(
                                      application.programId.ml_requirements
                                    )
                                  }
                                >
                                  <AiOutlineMore size={20} />
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                          </Col>
                          <Col md={3}>
                            <h5>
                              {application.programId.school}
                              {" - "}
                              {application.programId.program_name}
                            </h5>
                          </Col>
                          <Col md={3}></Col>
                        </Row>

                        <ManualFiles
                          onDeleteProgramSpecificThread={
                            this.onDeleteProgramSpecificThread
                          }
                          onCommentsProgramSpecific={
                            this.onCommentsProgramSpecific
                          }
                          onStudentFeedbackProgramSpecific={
                            this.onStudentFeedbackProgramSpecific
                          }
                          SubmitProgramSpecificFile={
                            this.SubmitProgramSpecificFile
                          }
                          onDownloadProgramSpecificFile={
                            this.onDownloadProgramSpecificFile
                          }
                          handleAsFinalProgramSpecific={
                            this.handleAsFinalProgramSpecific
                          }
                          role={this.props.role}
                          student={this.state.student}
                          application={application}
                          filetype={"ProgramSpecific"}
                          initGeneralFileThread={this.initGeneralFileThread}
                          initProgramSpecificFileThread={
                            this.initProgramSpecificFileThread
                          }
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </Card.Body>
            </div>
          </Collapse>{" "}
          {!isLoaded && (
            <div style={style}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            </div>
          )}
        </Card>
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
            <Button
              disabled={!isLoaded}
              onClick={this.ConfirmDeleteGeneralFileThreadHandler}
            >
              Yes
            </Button>

            <Button onClick={this.closeWarningWindow}>No</Button>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.SetAsFinalFileModel}
          onHide={this.closeSetAsFinalFileModelWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to set {this.state.docName} as final for student?
          </Modal.Body>
          <Modal.Footer>
            {this.state.filetype === "General" ? (
              <Button
                disabled={!isLoaded}
                onClick={this.ConfirmSetAsFinalGeneralFileHandler}
              >
                Yes
              </Button>
            ) : (
              <Button
                disabled={!isLoaded}
                onClick={this.ConfirmSetAsFinalSpecificFileHandler}
              >
                Yes
              </Button>
            )}

            <Button onClick={this.closeSetAsFinalFileModelWindow}>No</Button>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.UndoFinalFileModel}
          onHide={this.closeUndoFinalFileModelWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to undo {this.state.docName} as final for student?
          </Modal.Body>
          <Modal.Footer>
            {this.state.filetype === "General" ? (
              <Button
                disabled={!isLoaded}
                onClick={this.ConfirmSetAsFinalGeneralFileHandler}
              >
                Yes
              </Button>
            ) : (
              <Button
                disabled={!isLoaded}
                onClick={this.ConfirmSetAsFinalSpecificFileHandler}
              >
                Yes
              </Button>
            )}

            <Button onClick={this.closeUndoFinalFileModelWindow}>No</Button>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.ML_Requirements_Modal}
          onHide={this.closeML_Requirements_ModalWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Special ML Requirements
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.ml_requirements}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeML_Requirements_ModalWindow}>
              Close
            </Button>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <DraftEditor
          error={error}
          whoupdate={this.state.whoupdate}
          isLoaded={isLoaded}
          student={this.state.student}
          show={this.state.CommentsModel}
          onHide={this.closeCommentsWindow}
          defaultComments={this.state.comments}
          updatedAt={this.state.updatedAt}
          onClick1={this.ConfirmCommentsGeneralFileHandler}
          onClick2={this.ConfirmCommentsProgramSpecificFileHandler}
          onClick3={this.closeCommentsWindow}
          setMessage={this.setState}
          docName={this.state.docName}
          role={this.props.role}
          filetype={this.state.filetype}
        />
        <DraftEditor_StudentFeeback
          error={error}
          whoupdate={this.state.whoupdate}
          isLoaded={isLoaded}
          student={this.state.student}
          show={this.state.StudentFeedbackModel}
          onHide={this.closeStudentFeebackProgramSpecificFileModelWindow}
          defaultComments={this.state.student_feedback}
          student_feedback_updatedAt={this.state.student_feedback_updatedAt}
          ConfirmStudentFeedbackProgramSpecificFileHandler={
            this.ConfirmStudentFeedbackProgramSpecificFileHandler
          }
          ConfirmStudentFeedbackGeneralFileHandler={
            this.ConfirmStudentFeedbackGeneralFileHandler
          }
          closeStudentFeebackProgramSpecificFileModelWindow={
            this.closeStudentFeebackProgramSpecificFileModelWindow
          }
          setMessage={this.setState}
          docName={this.state.docName}
          role={this.props.role}
          filetype={this.state.filetype}
        />
      </>
    );
  }
}

export default EditorDocsProgress;
