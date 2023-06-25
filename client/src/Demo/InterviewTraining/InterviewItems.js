import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HiX } from 'react-icons/hi';
import { is_TaiGer_AdminAgent } from '../Utils/checking-functions';

class InterviewItems extends React.Component {
  render() {
    return (
      <>
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <Row>
                  <span style={{ float: 'right', cursor: 'pointer' }}>
                    {is_TaiGer_AdminAgent(this.props.user) && (
                      <HiX
                        size={24}
                        color="red"
                        title="Delete"
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          this.props.openDeleteDocModalWindow(
                            this.props.interview
                          )
                        }
                      />
                    )}
                  </span>
                </Row>
                <Row>Stats: {`${this.props.interview.status}`}</Row>
              </Col>
              <Col>
                <Link
                  to={`interview-training/${this.props.interview._id.toString()}`}
                >
                  {`${this.props.interview.program_id.school} - ${this.props.interview.program_id.program_name} ${this.props.interview.program_id.degree}`}
                  <br />
                  <i className="feather icon-calendar me-1" />
                  {`${this.props.interview.interview_date} - ${this.props.interview.interview_time}`}
                </Link>
              </Col>
            </Row>
            <Row>
              <Col></Col>
              <Col></Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default InterviewItems;
