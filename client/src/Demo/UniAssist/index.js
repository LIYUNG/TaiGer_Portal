import React from 'react';
import {
  Row,
  Col,
  Form,
  Table,
  Button,
  Card,
  Collapse,
  Modal,
  Spinner
} from 'react-bootstrap';
import { getStudent } from '../../api';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import UniAssistListCard from './UniAssistListCard';
import { Redirect } from 'react-router-dom';
class UniAssistList extends React.Component {
  state = {
    isLoaded: false,
    student: null,
    timeouterror: null,
    unauthorizederror: null,
    deleteVPDFileWarningModel: false
  };
  componentDidMount() {
    getStudent(this.props.user._id.toString()).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({ isLoaded: true, student: data, success: success });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
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
    const { unauthorizederror, timeouterror, isLoaded } = this.state;

    if (timeouterror) {
      return (
        <div>
          <TimeOutErrors />
        </div>
      );
    }
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
        </div>
      );
    }

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
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
