import React from "react";
import { Form, Row, Col, Spinner, Card } from "react-bootstrap";
class SingleProgramEdit extends React.Component {
  state = {
    program: null,
  };
  handleChange = () => {};
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
                <h5>
                  <Form.Group controlId="school">
                    <Form.Control
                      type="text"
                      placeholder="National Taiwan University"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.school
                          ? this.props.program.school
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Program</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="program">
                    <Form.Control
                      type="text"
                      placeholder="Electrical Engineering"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.program
                          ? this.props.program.program
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Degree</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="degree">
                    <Form.Control
                      type="text"
                      placeholder="M.Sc."
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.degree
                          ? this.props.program.degree
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Semester</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="semester">
                    <Form.Control
                      type="text"
                      placeholder="Winter"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.semester
                          ? this.props.program.semester
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row> </Row>
            <Row>
              <Col md={4}>
                <h5>Teaching Language</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="language">
                    <Form.Control
                      type="text"
                      placeholder="English"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.language
                          ? this.props.program.language
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Application Start</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="application_start">
                    <Form.Control
                      type="text"
                      placeholder="05-31"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.application_start
                          ? this.props.program.application_start
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Application Deadline</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="application_deadline">
                    <Form.Control
                      type="text"
                      placeholder="05-31"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.application_deadline
                          ? this.props.program.application_deadline
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Need Uni-Assist?</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="uni_assist">
                    <Form.Control
                      type="text"
                      placeholder="Yes - Full"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.uni_assist
                          ? this.props.program.uni_assist
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>TOEFL Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="toefl">
                    <Form.Control
                      type="text"
                      placeholder="88"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.toefl ? this.props.program.toefl : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>IELTS Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="ielts">
                    <Form.Control
                      type="text"
                      placeholder="6.5"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.ielts ? this.props.program.ielts : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>TestDaF Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="testdaf">
                    <Form.Control
                      type="text"
                      placeholder="4"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.testdaf
                          ? this.props.program.testdaf
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>GRE Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="gre">
                    <Form.Control
                      type="text"
                      placeholder="V145Q160"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.gre ? this.props.program.gre : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>GMAT Requirement</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="gmat">
                    <Form.Control
                      type="text"
                      placeholder="640"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.gmat ? this.props.program.gmat : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>ML Required?</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="ml_required">
                    <Form.Control
                      type="text"
                      placeholder="Yes"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.ml_required
                          ? this.props.program.ml_required
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>ML Requirements</h5>
              </Col>
              <Col md={6}>
                <h5>
                  <Form.Group controlId="ml_requirements">
                    <Form.Control
                      as="textarea"
                      rows="5"
                      placeholder="1200-1500words"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.ml_requirements
                          ? this.props.program.ml_requirements
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>RL Required?</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="rl_required">
                    <Form.Control
                      type="text"
                      placeholder="Yes"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.rl_required
                          ? this.props.program.rl_required
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>RL Requirements</h5>
              </Col>
              <Col md={6}>
                <h5>
                  <Form.Group controlId="rl_requirements">
                    <Form.Control
                      as="textarea"
                      rows="5"
                      placeholder="1 page"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.rl_requirements
                          ? this.props.program.rl_requirements
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              {" "}
              <Col md={4}>
                <h5>Essay Required?</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="essay_required">
                    <Form.Control
                      type="text"
                      placeholder="Yes"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.essay_required
                          ? this.props.program.essay_required
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Essay Requirements</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="essay_requirements">
                    <Form.Control
                      type="text"
                      placeholder="2000 words"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.essay_requirements
                          ? this.props.program.essay_requirements
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Special Notes</h5>
              </Col>
              <Col md={6}>
                <h5>
                  <Form.Group controlId="special_notes">
                    <Form.Control
                      as="textarea"
                      rows="5"
                      placeholder="2000 words"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.special_notes
                          ? this.props.program.special_notes
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              {" "}
              <Col md={4}>
                <h5>Comments</h5>
              </Col>
              <Col md={6}>
                <h5>
                  <Form.Group controlId="comments">
                    <Form.Control
                      as="textarea"
                      rows="5"
                      placeholder="2000 words"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.comments
                          ? this.props.program.comments
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Portal Link 1</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="application_portal_a">
                    <Form.Control
                      type="text"
                      placeholder="url"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.application_portal_a
                          ? this.props.program.application_portal_a
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Portal Link 2</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="application_portal_b">
                    <Form.Control
                      type="text"
                      placeholder="url"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.application_portal_b
                          ? this.props.program.application_portal_b
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Website</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="website">
                    <Form.Control
                      type="text"
                      placeholder="url"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.website
                          ? this.props.program.website
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>FPSO</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="fpso">
                    <Form.Control
                      type="text"
                      placeholder="url"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.fpso ? this.props.program.fpso : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Last Update</h5>
              </Col>
              <Col md={4}>
                <h5>
                  <Form.Group controlId="updatedAt">
                    <Form.Control
                      type="text"
                      placeholder="2022-05-30"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.updatedAt
                          ? this.props.program.updatedAt
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Updated by</h5>
              </Col>
              <Col md={6}>
                <h5>
                  <Form.Group controlId="whoupdated">
                    <Form.Control
                      type="text"
                      placeholder="Tina Wang"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.whoupdated
                          ? this.props.program.whoupdated
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <h5>Group</h5>
              </Col>
              <Col md={6}>
                <h5>
                  <Form.Group controlId="study_group_flag">
                    <Form.Control
                      type="text"
                      placeholder="ee"
                      onChange={(e) => this.handleChange(e)}
                      defaultValue={
                        this.props.program.study_group_flag
                          ? this.props.program.study_group_flag
                          : ""
                      }
                    />
                  </Form.Group>
                </h5>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default SingleProgramEdit;
