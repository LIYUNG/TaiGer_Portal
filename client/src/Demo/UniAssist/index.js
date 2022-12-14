import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import UniAssistListCard from './UniAssistListCard';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getStudent } from '../../api';

class UniAssistList extends React.Component {
  state = {
    isLoaded: false,
    student: null,
    deleteVPDFileWarningModel: false,
    res_status: 0
  };
  componentDidMount() {
    getStudent(this.props.user._id.toString()).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

  render() {
    if (this.props.user.role !== 'Student') {
      return <Redirect to="/dashboard/default" />;
    }
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.student) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    return (
      <>
        <Row>
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Uni-Assist Tasks & VPD
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Body className="my-0 mx-0 text-light">
                Instructions
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <UniAssistListCard
          student={this.state.student}
          role={this.props.user.role}
        />
      </>
    );
  }
}
export default UniAssistList;
