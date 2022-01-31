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
import ButtonSetUploaded from "./ButtonSetUploaded";
import ButtonSetAccepted from "./ButtonSetAccepted";
import ButtonSetRejected from "./ButtonSetRejected";
import ButtonSetNotNeeded from "./ButtonSetNotNeeded";
import ButtonSetMissing from "./ButtonSetMissing";
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

class EditFilesSubpage extends React.Component {
  state = {
    student: this.props.student,
    student_id: "",
    docName: "",
    file: "",
  };

  handleGeneralDocSubmit = (e, studentId, fileCategory) => {
    e.preventDefault();
    this.props.SubmitGeneralFile(e, studentId, fileCategory);
  };
  render() {
    const deleteStyle = "danger";
    const graoutStyle = "light";
    let value2 = Object.values(this.props.documentlist2);
    let keys2 = Object.keys(this.props.documentlist2);
    let object_init = {};
    let object_message = {};
    let object_date_init = {};
    let object_time_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = "missing";
      object_message[keys2[i]] = "";
      object_date_init[keys2[i]] = "";
      object_time_init[keys2[i]] = "";
    }

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === "uploaded") {
          object_init[this.props.student.profile[i].name] = "uploaded";
        } else if (this.props.student.profile[i].status === "accepted") {
          object_init[this.props.student.profile[i].name] = "accepted";
        } else if (this.props.student.profile[i].status === "rejected") {
          object_init[this.props.student.profile[i].name] = "rejected";
        } else if (this.props.student.profile[i].status === "notneeded") {
          object_init[this.props.student.profile[i].name] = "notneeded";
        } else if (this.props.student.profile[i].status === "missing") {
          object_init[this.props.student.profile[i].name] = "missing";
        }
        object_message[this.props.student.profile[i].name] = this.props.student
          .profile[i].feedback
          ? this.props.student.profile[i].feedback
          : "";
        object_date_init[this.props.student.profile[i].name] = new Date(
          this.props.student.profile[i].updatedAt
        ).toLocaleDateString();
        object_time_init[this.props.student.profile[i].name] = new Date(
          this.props.student.profile[i].updatedAt
        ).toLocaleTimeString();
      }
    } else {
    }
    var documentlist22;
    documentlist22 = keys2.map((k, i) => {
      if (object_init[k] === "uploaded") {
        return (
          <ButtonSetUploaded
            key={i + 1}
            role={this.props.role}
            isLoaded={this.props.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student_id={this.props.student._id}
            onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={
              this.props.onUpdateProfileFilefromstudent
            }
            SubmitGeneralFile={this.props.SubmitGeneralFile}
          />
        );
      } else if (object_init[k] === "accepted") {
        return (
          <ButtonSetAccepted
            key={i + 1}
            role={this.props.role}
            isLoaded={this.props.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student_id={this.props.student._id}
            onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={
              this.props.onUpdateProfileFilefromstudent
            }
            SubmitGeneralFile={this.props.SubmitGeneralFile}
            deleteFileWarningModel={this.props.deleteFileWarningModel}
          />
        );
      } else if (object_init[k] === "rejected") {
        return (
          <ButtonSetRejected
            key={i + 1}
            role={this.props.role}
            isLoaded={this.props.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            message={object_message[k]}
            student_id={this.props.student._id}
            onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={
              this.props.onUpdateProfileFilefromstudent
            }
            SubmitGeneralFile={this.props.SubmitGeneralFile}
            deleteFileWarningModel={this.props.deleteFileWarningModel}
          />
        );
      } else if (object_init[k] === "notneeded") {
        return (
          <ButtonSetNotNeeded
            key={i + 1}
            role={this.props.role}
            isLoaded={this.props.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student_id={this.props.student._id}
            onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={
              this.props.onUpdateProfileFilefromstudent
            }
            SubmitGeneralFile={this.props.SubmitGeneralFile}
            deleteFileWarningModel={this.props.deleteFileWarningModel}
          />
        );
      } else {
        return (
          <ButtonSetMissing
            key={i + 1}
            role={this.props.role}
            isLoaded={this.props.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            message={object_message[k]}
            student_id={this.props.student._id}
            onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={
              this.props.onUpdateProfileFilefromstudent
            }
            SubmitGeneralFile={this.props.SubmitGeneralFile}
          />
        );
      }
    });

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
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>File Name:</th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>{documentlist22}</tbody>
                  </Table>
                </Row>
                <Row>{this.props.SYMBOL_EXPLANATION}</Row>
              </Card.Body>
            </div>
          </Collapse>
        </Card>
      </>
    );
  }
}

export default EditFilesSubpage;
