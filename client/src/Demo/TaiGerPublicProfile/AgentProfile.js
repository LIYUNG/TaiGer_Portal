import React from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import TimezoneSelect from 'react-timezone-select';
import Select from 'react-select';

import Aux from '../../hoc/_Aux';
import { spinner_style, time_slots } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { getAgentProfile } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_Student } from '../Utils/checking-functions';
import { Link } from 'react-router-dom';

class AgentProfile extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    agent: {},
    selectedTimezone:
      this.props.user.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    updateconfirmed: false,
    updatecredentialconfirmed: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getAgentProfile(this.props.match.params.user_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            agent: data,
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
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.user_id !== this.props.match.params.user_id) {
      getAgentProfile(this.props.match.params.user_id).then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              agent: data,
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
  }

  setSelectedTimezone = (e) => {
    this.setState({ selectedTimezone: e.value, officehoursModifed: true });
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_status, isLoaded, res_modal_status, res_modal_message } =
      this.state;

    if (!isLoaded) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    TabTitle(`Agent Profile`);
    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row>
          <Col>
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  {this.state.agent.firstname} {this.state.agent.lastname}{' '}
                  Profile
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Row>
                      <h5 className="text-light">Email:</h5>
                      <p className="text-info">{this.state.agent.email}</p>
                    </Row>
                    <Row>
                      <h5 className="text-light">Introduction</h5>
                      {this.state.agent.selfIntroduction}
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Card className="my-0 py-0 mx-0" bg={'dark'} text={'white'}>
                      <Card.Header>
                        <Card.Title className="my-0 mx-0 text-light">
                          Office Hours
                        </Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col>
                            <h5 className="text-light">Time zone</h5>
                          </Col>
                        </Row>
                        <Row>
                          <TimezoneSelect
                            value={this.state.selectedTimezone}
                            displayValue="UTC"
                            isDisabled={true}
                          />
                        </Row>
                        <br />
                        {[
                          'Monday',
                          'Tuesday',
                          'Wednesday',
                          'Thursday',
                          'Friday',
                          'Saturday',
                          'Sunday'
                        ].map((day, i) => (
                          <Row key={i}>
                            <Col md={4}>
                              <Form>
                                <Form.Check
                                  type="switch"
                                  id={`${day}`}
                                  label={`${day}`}
                                  readOnly
                                  className={`${
                                    this.state.agent.officehours[day]?.active
                                      ? 'text-light'
                                      : 'text-secondary'
                                  }`}
                                  checked={
                                    this.state.agent.officehours[day]?.active
                                  }
                                />
                              </Form>
                            </Col>
                            <Col md={8}>
                              {this.state.agent.officehours &&
                              this.state.agent.officehours[day]?.active ? (
                                <>
                                  <span className="text-light">Timeslots</span>
                                  <Select
                                    id={`${day}`}
                                    options={time_slots}
                                    isMulti
                                    isDisabled={true}
                                    value={
                                      this.state.agent.officehours[day]
                                        .time_slots
                                    }
                                    onChange={(e) =>
                                      this.onTimeStartChange(e, day)
                                    }
                                  />
                                </>
                              ) : (
                                <span className="text-light">Close</span>
                              )}
                            </Col>
                          </Row>
                        ))}
                        {is_TaiGer_Student(this.props.user) && (
                          <>
                            <br />
                            <Row>
                              <h5 className="text-light">想要與顧問討論？</h5>
                              <Link
                                to={`/events/students/${this.props.user._id.toString()}`}
                              >
                                <Button>預約</Button>
                              </Link>
                            </Row>
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default AgentProfile;
