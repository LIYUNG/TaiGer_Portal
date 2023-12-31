import React, { Fragment } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

import UniAssistListCard from './UniAssistListCard';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getStudentUniAssist } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { FiExternalLink } from 'react-icons/fi';
import { check_uni_assist_needed } from '../Utils/checking-functions';

class UniAssistList extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    student: null,
    deleteVPDFileWarningModel: false,
    res_status: 0
  };
  componentDidMount() {
    getStudentUniAssist(this.props.user._id.toString()).then(
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
    if (this.props.user.role !== 'Student') {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('Uni-Assist & VPD');
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

        {check_uni_assist_needed(this.state.student) ? (
          <Fragment>
            <Row>
              <Col>
                <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
                  <Card.Body className="my-0 mx-0 text-light">
                    請依照指示，完成Uni-Assist帳號密碼以及上傳資料{` `}
                    <Link
                      to={`${DEMO.UNI_ASSIST_DOCS_LINK}`}
                      className="text-info"
                    >
                      Uni-Assist{' '}
                      <FiExternalLink
                        className="mx-1 mb-1"
                        style={{ cursor: 'pointer' }}
                      />
                    </Link>
                    <br />
                    Instructions: Follow the documentations in{' '}
                    <Link
                      to={`${DEMO.UNI_ASSIST_DOCS_LINK}`}
                      className="text-info"
                    >
                      Uni-Assist{' '}
                      <FiExternalLink
                        className="mx-1 mb-1"
                        style={{ cursor: 'pointer' }}
                      />
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <UniAssistListCard
              student={this.state.student}
              role={this.props.user.role}
              user={this.props.user}
            />
          </Fragment>
        ) : (
          <Card>
            <Card.Body>
              Based on the applications, Uni-Assist is NOT needed.
            </Card.Body>
          </Card>
        )}
      </>
    );
  }
}
export default UniAssistList;
