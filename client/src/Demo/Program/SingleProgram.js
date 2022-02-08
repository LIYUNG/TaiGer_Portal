import React from "react";
import { Dropdown, Row, Col, Spinner, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getProgram } from "../../api";
class SingleProgram extends React.Component {
  state = {
    isLoaded: false,
    program: "",
    success: false,
    error: null,
  };
  componentDidMount() {
    getProgram(this.props.match.params.programId).then(
      (resp) => {
        console.log(resp);
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            program: data,
            success: success,
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  }
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
    console.log(this.state.program);
    if (!isLoaded && !this.state.program) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    console.log(this.state.program);
    return (
      <>
        <Card>
          <Card.Body>
            <Row>
              <Col md={4}>
                <h5>University</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.school}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Program</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.program}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Degree</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.degree}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Semester</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.semester}</h5>
              </Col>
            </Row>
            <Row> </Row>
            <Row>
              <Col md={4}>
                <h5>Teaching Language</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.language}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Application Start</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.application_start}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Application Deadline</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.application_deadline}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Need Uni-Assist?</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.uni_assist}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>TOEFL Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.toefl}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>IELTS Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.ielts}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>TestDaF Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.testdaf}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>GRE Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.gre}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>GMAT Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.gmat}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>ML Required?</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.ml_required}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>ML Requirements</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.ml_requirements}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>RL Required?</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.rl_required}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>RL Requirements</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.rl_requirements}</h5>
              </Col>
            </Row>
            <Row>
              {" "}
              <Col md={4}>
                <h5>Essay Required?</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.essay_required}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Essay Requirements</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.essay_requirements}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Special Notes</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.special_notes}</h5>
              </Col>
            </Row>
            <Row>
              {" "}
              <Col md={4}>
                <h5>Comments</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.comments}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Portal Link 1</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.application_portal_a}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Portal Link 2</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.application_portal_b}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Website</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.website}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>FPSO</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.fpso}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Last Update</h5>
              </Col>
              <Col md={4}>
                <h5>{this.state.program.updatedAt}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Updated by</h5>
              </Col>
              <Col md={6}>
                <h5>{this.state.program.whoupdated}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Group</h5>
              </Col>
              <Col md={6}>
                <h5>{this.state.program.study_group_flag}</h5>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default SingleProgram;
