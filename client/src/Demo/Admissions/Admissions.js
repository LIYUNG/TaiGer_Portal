import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import AdmissionsTable from './AdmissionsTable';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';

import { getAdmissions, getArchivStudents } from '../../api';

class Admissions extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
    isLoaded: false,
    students: [],
    success: false
  };

  componentDidMount() {
    getAdmissions().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({ isLoaded: true, students: data, success: success });
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
    if (!isLoaded && !this.state.data) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    } else {
      if (this.state.success) {
        return (
          <Aux>
            <Row>
              <Col>
                {/* <Card.Body> */}
                {this.props.user.role === 'Admin' ||
                this.props.user.role === 'Agent' ||
                this.props.user.role === 'Editor' ? (
                  <AdmissionsTable students={this.state.students} />
                ) : (
                  <></>
                )}
                {!isLoaded && (
                  <div style={style}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden"></span>
                    </Spinner>
                  </div>
                )}
                {/* </Card.Body> */}
              </Col>
            </Row>
          </Aux>
        );
      }
    }
  }
}

export default Admissions;
