import React from "react";
import { Dropdown, Row, Col, Spinner, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getProgram } from "../../api";
class SingleProgramView extends React.Component {
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <Row>
              <Col md={4}>
                <h5>University</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.school}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Program</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.program_name}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Degree</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.degree}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Semester</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.semester}</h5>
              </Col>
            </Row>
            <Row> </Row>
            <Row>
              <Col md={4}>
                <h5>Teaching Language</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.language}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Application Start (MM-DD)</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.application_start}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Application Deadline (MM-DD)</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.application_deadline}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Need Uni-Assist?</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.uni_assist}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>TOEFL Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.toefl}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>IELTS Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.ielts}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>TestDaF Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.testdaf}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>GRE Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.gre}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>GMAT Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.gmat}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>ML Required?</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.ml_required}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>ML Requirements</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.ml_requirements}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>RL Required?</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.rl_required}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>RL Requirements</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.rl_requirements}</h5>
              </Col>
            </Row>
            <Row>
              {" "}
              <Col md={4}>
                <h5>Essay Required?</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.essay_required}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Essay Requirements</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.essay_requirements}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Special Notes</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.special_notes}</h5>
              </Col>
            </Row>
            <Row>
              {" "}
              <Col md={4}>
                <h5>Comments</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.comments}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Portal Link 1</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.application_portal_a}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Portal Link 2</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.application_portal_b}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Website</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.website}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>FPSO</h5>
              </Col>
              <Col md={4}>
                <h5>{this.props.program.fpso}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Last Update</h5>
              </Col>
              <Col md={4}>
                <h5>
                  {new Date(this.props.program.updatedAt).toLocaleDateString()}
                  {", "}
                  {new Date(this.props.program.updatedAt).toLocaleTimeString()}
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Updated by</h5>
              </Col>
              <Col md={6}>
                <h5>{this.props.program.whoupdated}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Group</h5>
              </Col>
              <Col md={6}>
                <h5>{this.props.program.study_group_flag}</h5>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default SingleProgramView;
