import React from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import { profile_name_list } from '../Utils/contants';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getEditor } from '../../api';
import CVMLRLOverview from '../CVMLRLCenter/CVMLRLOverview';

class EditorPage extends React.Component {
  state = {
    error: null,
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    editor: null,
    students: null,
    academic_background: {},
    application_preference: {},
    updateconfirmed: false,
    res_status: 0
  };

  componentDidMount() {
    getEditor(this.props.match.params.user_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            editor: data.editor,
            students: data.students,
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
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Editor'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.editor && !this.state.students) {
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
      <Aux>
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">
                      TaiGer Team Editor:{' '}
                      <b>
                        {this.state.editor.firstname}{' '}
                        {this.state.editor.lastname}
                      </b>
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <CVMLRLOverview
          isLoaded={this.state.isLoaded}
          user={this.props.user}
          success={this.state.success}
          students={this.state.students}
        />
      </Aux>
    );
  }
}

export default EditorPage;
