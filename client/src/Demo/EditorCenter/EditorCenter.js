import React from "react";
import { Row, Col, Button, Card, Collapse, Spinner } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import { getStudents } from "../../api";

class EditorCenter extends React.Component {
  state = {
    error: null,
    isLoaded: false,
    data: null,
    success: false,
    // accordionKeys: new Array(-1, this.props.user.students.length),  // To collapse all
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
    let students_card;
    students_card = this.state.students.map((student, idx) => (
      <Card className="mt-2" key={idx}>
        <Card.Header>
          <Card.Title as="h5">
            <a
              href={DEMO.BLANK_LINK}
              onClick={() => this.singleExpandtHandler(idx)}
              aria-controls="accordion1"
              aria-expanded={accordionKeys[idx] === idx}
            >
              {student.firstname}
              {" ,"}
              {student.lastname}
            </a>
          </Card.Title>
        </Card.Header>
        <Collapse in={this.state.accordionKeys[idx] === idx}>
          <div id="accordion1">
            <Card.Body>
              <Card.Text>
                {student.applications.map((application, i) => (
                  <>
                    <h5>
                      {application.programId.University_}
                      {" - "}
                      {application.programId.Program_}
                    </h5>
                    <Button className="btn btn-primary" size="sm">
                      Upload
                    </Button>
                  </>
                ))}
              </Card.Text>
              {/* {JSON.stringify(student)} */}
            </Card.Body>
          </div>
        </Collapse>
      </Card>
    ));

    return (
      <Aux>
        <Row>
          <Col sm={12} className="accordion">
            <h5>Accordion Example</h5>
            <hr />
            {students_card}
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default EditorCenter;
