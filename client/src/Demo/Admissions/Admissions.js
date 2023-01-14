import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import AdmissionsTable from './AdmissionsTable';
import ErrorPage from '../Utils/ErrorPage';
import { spinner_style } from '../Utils/contants';

import { getAdmissions } from '../../api';

class Admissions extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    students: [],
    success: false,
    res_status: 0
  };

  componentDidMount() {
    getAdmissions().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
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
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }

  render() {
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.data) {
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
              {/* </Card.Body> */}
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default Admissions;
