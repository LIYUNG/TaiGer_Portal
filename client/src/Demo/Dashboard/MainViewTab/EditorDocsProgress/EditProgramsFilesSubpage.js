import React from "react";
// import { FaBeer } from 'react-icons/fa';
import { Button, Table, Col, Form, Modal } from "react-bootstrap";
// import UcFirst from "../../../App/components/UcFirst";
import {
  AiOutlineDownload,
  AiFillCloseCircle,
  AiFillQuestionCircle,
} from "react-icons/ai";
import ManualFiles from "./ManualFiles";
import { IoCheckmarkCircle } from "react-icons/io5";
import {
  createManualFileUploadPlace,
  deleteManualFileUploadPlace,
  createArticle,
  getApplicationArticle,
} from "../../../../api";
class EditProgramsFilesSubpage extends React.Component {
  // edit File subpage
  state = {
    student: this.props.student,
  };
  createManualFileUpload = (studentId, applicationId, docName) => {
    createManualFileUploadPlace(studentId, applicationId, docName).then(
      (resp) => {
        console.log(resp.data.data);
        this.setState({
          student: resp.data.data,
        });
      },
      (error) => {}
    );
  };

  deleteManualFileUpload = (studentId, applicationId, docName) => {
    deleteManualFileUploadPlace(studentId, applicationId, docName).then(
      (resp) => {
        console.log(resp.data.data);
        this.setState({
          student: resp.data.data,
        });
      },
      (error) => {}
    );
  };
  render() {
    // Edit Program
    let programstatus;
    if (this.state.student.applications) {
      programstatus = this.state.student.applications.map((application, i) => (
        <>
          <tr key={i}>
            {/* <th></th> */}
            <td>
              <h4 className="mb-1">
                {application.programId.University_} -{" "}
                {application.programId.Program_}
              </h4>
              <h5 className="mb-1">{application.programId.documents}</h5>
            </td>
            <td>
              {/* <Form
              // onSubmit={(e) =>
              //   this.props.onDeleteProgram(
              //     e,
              //     this.props.student._id,
              //     application._id
              //   )
              // }
              >
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <div className="form-group">
                    <Button type="submit">Delete</Button>
                  </div>
                </Form.Group>
              </Form> */}
            </td>
          </tr>
          <tr>
            <ManualFiles
              createManualFileUpload={this.createManualFileUpload}
              deleteManualFileUpload={this.deleteManualFileUpload}
              role={this.props.role}
              student={this.state.student}
              application={application}
            />
          </tr>
        </>
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
            Program for {this.state.student.firstname} -{" "}
            {this.state.student.lastname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <tbody>{programstatus}</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.setmodalhide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditProgramsFilesSubpage;
