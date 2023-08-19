import React from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Modal,
  Tabs,
  Tab
} from 'react-bootstrap';
import TimezoneSelect from 'react-timezone-select';
import Select from 'react-select';

import Aux from '../../hoc/_Aux';
import {
  spinner_style,
  getNextDayDate,
  getTodayAsWeekday,
  getReorderWeekday,
  shiftDateByOffset,
  getTimezoneOffset
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { getEvents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_Student } from '../Utils/checking-functions';
import MyCalendar from '../../components/Calendar/components/Calendar';
import { DateTime } from 'luxon';

class OfficeHours extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    agent: {},
    hasEvents: false,
    updateconfirmed: false,
    updatecredentialconfirmed: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getEvents(this.props.match.params.user_id).then(
      (resp) => {
        const { data, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            agent: data,
            hasEvents,
            events: data,
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
      getEvents(this.props.match.params.user_id).then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              agent: data,
              hasEvents,
              events: data,
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

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const {
      hasEvents,
      events,
      res_status,
      isLoaded,
      res_modal_status,
      res_modal_message
    } = this.state;

    if (!isLoaded) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    TabTitle(`Office Hours`);
    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }
    const reorder_weekday = getReorderWeekday(
      getTodayAsWeekday(this.state.agent.timezone)
    );
    const agents = this.state.agent;
    console.log(agents);
    const available_termins = [0, 1, 2, 3].flatMap((iter, x) =>
      agents.flatMap((xx, idx) =>
        reorder_weekday.flatMap((day, i) => {
          const timeSlots =
            agents[idx].officehours &&
            agents[idx].officehours[day]?.active &&
            agents[idx].officehours[day].time_slots
              .sort((a, b) => (a.value < b.value ? -1 : 1))
              .map((time_slot, j) => ({
                id: j * 10 + i * 100 + x * 1000 + 1,
                title: `${
                  (parseInt(time_slot.value.split(':')[0], 10) +
                    getTimezoneOffset(
                      Intl.DateTimeFormat().resolvedOptions().timeZone
                    ) -
                    getTimezoneOffset(agents[idx].timezone)) %
                  24
                }:${time_slot.value.split(':')[1]}`,
                start: shiftDateByOffset(
                  new Date(
                    getNextDayDate(
                      reorder_weekday,
                      day,
                      agents[idx].timezone,
                      iter
                    ).year,
                    getNextDayDate(
                      reorder_weekday,
                      day,
                      agents[idx].timezone,
                      iter
                    ).month - 1,
                    getNextDayDate(
                      reorder_weekday,
                      day,
                      agents[idx].timezone,
                      iter
                    ).day,
                    parseInt(time_slot.value.split(':')[0], 10),
                    parseInt(time_slot.value.split(':')[1], 10)
                  ),
                  getTimezoneOffset(
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                  ) - getTimezoneOffset(agents[idx].timezone)
                ),
                end: shiftDateByOffset(
                  new Date(
                    getNextDayDate(
                      reorder_weekday,
                      day,
                      agents[idx].timezone,
                      iter
                    ).year,
                    getNextDayDate(
                      reorder_weekday,
                      day,
                      agents[idx].timezone,
                      iter
                    ).month - 1,
                    getNextDayDate(
                      reorder_weekday,
                      day,
                      agents[idx].timezone,
                      iter
                    ).day,
                    parseInt(time_slot.value.split(':')[0], 10),
                    parseInt(time_slot.value.split(':')[1], 10)
                  ),
                  getTimezoneOffset(
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                  ) -
                    getTimezoneOffset(agents[idx].timezone) +
                    0.5
                ),
                description: ''
              }));

          return timeSlots || [];
        })
      )
    );
    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        {hasEvents ? (
          <>
            {events?.map((event, i) => (
              <Card>
                <Card.Header>
                  <Card.Title></Card.Title>
                </Card.Header>
                {event.taiger_user_id?.map((taiger_user, x) => (
                  <p>
                    {taiger_user.firstname} {taiger_user.lastname}{' '}
                    {taiger_user.email}
                  </p>
                ))}
                <br />
                {event.description}
                <br />
                {event.isConfirmed}
                <br />
                {event.title}
                <br />
                {event.start}
                <br />
                {event.end}
                <br />
                {event.createdAt}
                <br />
                {event.updatedAt}
              </Card>
            ))}
          </>
        ) : (
          <>
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
                      <Col>
                        <h5 className="text-light">Email:</h5>
                        <p className="text-info">{this.state.agent.email}</p>
                      </Col>
                      <Col>
                        <h5 className="text-light">Office Hours</h5>
                        {/* {this.state.agent.officehours} */}
                      </Col>
                    </Row>
                    <Row>
                      <h5 className="text-light">Introduction</h5>
                      {this.state.agent.selfIntroduction}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Card>
              <Card.Header>
                <Card.Title>Office Hours</Card.Title>
              </Card.Header>
              <Card.Body>
                <Tabs
                  defaultActiveKey={'Calendar'}
                  id="Calendar-example"
                  fill={true}
                  justify={true}
                  className="py-0 my-0 mx-0"
                >
                  <Tab eventKey="Calendar" title="Calendar">
                    <MyCalendar
                      events={[
                        ...available_termins
                        // {
                        //   id: 7,
                        //   title: 'Meeting 5',
                        //   start: new Date(2023, 7, 25, 14, 0),
                        //   end: new Date(2023, 7, 25, 16, 0),
                        //   description: 'This is the second meeting description.'
                        // }
                      ]}
                      user={this.props.user}
                    />
                  </Tab>
                  <Tab eventKey="Appointment" title="Appointment">
                    {[0, 1, 2, 3].map((iter, x) =>
                      agents.flatMap((xx, idx) =>
                        reorder_weekday.map(
                          (day, i) =>
                            agents[idx].officehours &&
                            agents[idx].officehours[day]?.active &&
                            agents[idx].officehours[day].time_slots
                              .sort((a, b) => (a.value < b.value ? -1 : 1))
                              .map((time_slot, j) => (
                                <Card key={j} className="my-0 mx-0">
                                  <Card.Header>
                                    <Card.Title>
                                      {shiftDateByOffset(
                                        new Date(
                                          getNextDayDate(
                                            reorder_weekday,
                                            day,
                                            agents[idx].timezone,
                                            iter
                                          ).year,
                                          getNextDayDate(
                                            reorder_weekday,
                                            day,
                                            agents[idx].timezone,
                                            iter
                                          ).month - 1,
                                          getNextDayDate(
                                            reorder_weekday,
                                            day,
                                            agents[idx].timezone,
                                            iter
                                          ).day,
                                          parseInt(
                                            time_slot.value.split(':')[0],
                                            10
                                          ),
                                          parseInt(
                                            time_slot.value.split(':')[1],
                                            10
                                          )
                                        ),
                                        getTimezoneOffset(
                                          Intl.DateTimeFormat().resolvedOptions()
                                            .timeZone
                                        ) -
                                          getTimezoneOffset(
                                            agents[idx].timezone
                                          )
                                      ).toLocaleString()}
                                      {/* {getNextDayDate(day, this.state.agent.timezone, iter)}
                        {convertTimeToLocale(
                          getNextDayDate(day, this.state.agent.timezone, iter),
                          time_slot.value,
                          this.state.agent.timezone,
                          Intl.DateTimeFormat().resolvedOptions().timeZone
                        )} */}
                                    </Card.Title>
                                  </Card.Header>
                                </Card>
                              ))
                        )
                      )
                    )}
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </>
        )}

        {/* {is_TaiGer_Student(this.props.user) && (
          <Card className="my-2 mx-0" bg={'dark'} text={'white'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                Office Hours
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <TimezoneSelect
                  value={this.state.agent.timezone || ''}
                  displayValue="UTC"
                  isDisabled={true}
                />
              </Row>
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
                        className={`${
                          this.state.agent.officehours[day]?.active
                            ? 'text-light'
                            : 'text-secondary'
                        }`}
                        checked={this.state.agent.officehours[day]?.active}
                        readOnly
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
                          isDisabled={is_TaiGer_Student(this.props.user)}
                          value={this.state.agent.officehours[day].time_slots}
                          onChange={(e) => this.onTimeStartChange(e, day)}
                        />
                      </>
                    ) : (
                      <span className="text-light">Close</span>
                    )}
                  </Col>
                </Row>
              ))}
            </Card.Body>
          </Card>
        )} */}
      </Aux>
    );
  }
}

export default OfficeHours;
