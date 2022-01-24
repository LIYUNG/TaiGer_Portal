import React from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import {
  getStudents,
} from "../../api";
import EditorDocsProgress from "./EditorDocsProgress";
import ManualFiles from "./ManualFiles";

class EditorCenter extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    data: null,
    success: false,
    // accordionKeys: new Array(-1, this.props.user.students.length),  // To collapse all
    students: [],
    file: "",
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
        console.log("EditorCenter.js rendered");
        const { data, success } = resp.data;
        this.setState({
          isLoaded: true,
          students: data,
          success: success,
          accordionKeys: new Array(data.length).fill().map((x, i) => i), // to expand all
          //   accordionKeys: new Array(-1, data.length), // to collapse all
        });
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

  singleExpandtHandler = (idx) => {
    let accordionKeys = [...this.state.accordionKeys];
    accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
    this.setState((state) => ({
      ...state,
      accordionKeys: accordionKeys,
    }));
  };

  render() {
    const { error, isLoaded, accordionKeys } = this.state;
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

    const student_editor = this.state.students.map((student, i) => (
      <EditorDocsProgress
        key={i}
        idx={i}
        student={student}
        accordionKeys={this.state.accordionKeys}
        singleExpandtHandler={this.singleExpandtHandler}
        role={this.props.user.role}
        startEditingProgram={this.props.startEditingProgram}
        documentslist={this.props.documentslist}
        documenheader={this.props.documenheader}
        startUploadfile={this.props.startUploadfile}
        onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
        onRejectFilefromstudent={this.props.onRejectFilefromstudent}
        onAcceptFilefromstudent={this.props.onAcceptFilefromstudent}
        onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
      />
    ));

    return (
      <Aux>
        <Row>
          <Col sm={12} className="accordion">
            <h5>Editor Center</h5>
            <hr />
            {student_editor}
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default EditorCenter;
