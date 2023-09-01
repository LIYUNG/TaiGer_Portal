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
  Tab,
  Badge
} from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import {
  spinner_style,
  getNextDayDate,
  getTodayAsWeekday,
  getReorderWeekday,
  shiftDateByOffset,
  getTimezoneOffset,
  convertDate,
  getNumberOfDays
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import Banner from '../../components/Banner/Banner';

import {
  confirmEvent,
  deleteEvent,
  getEvents,
  postEvent,
  updateEvent
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import { is_TaiGer_Student } from '../Utils/checking-functions';
import {
  AiFillCheckCircle,
  AiFillQuestionCircle,
  AiOutlineCalendar,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMail,
  AiOutlineUser
} from 'react-icons/ai';
import EventConfirmationCard from '../../components/Calendar/components/EventConfirmationCard';
import { Redirect } from 'react-router-dom';
import DEMO from '../../store/constant';

class OfficeHours extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    agents: {},
    hasEvents: false,
    updateconfirmed: false,
    updatecredentialconfirmed: false,
    isDeleteModalOpen: false,
    isEditModalOpen: false,
    isConfirmModalOpen: false,
    event_temp: {},
    event_id: '',
    booked_events: [],
    selectedEvent: {},
    newReceiver: '',
    BookButtonDisable: false,
    newDescription: '',
    newEventTitle: '',
    newEventStart: null,
    newEventEnd: null,
    isNewEventModalOpen: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getEvents(this.props.match.params.user_id).then(
      (resp) => {
        const { data, agents, booked_events, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            agents,
            hasEvents,
            events: data,
            booked_events,
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
          const { data, agents, booked_events, hasEvents, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              agents,
              hasEvents,
              events: data,
              booked_events,
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

  handleConfirmAppointmentModal = (e, event_id, updated_event) => {
    e.preventDefault();
    this.setState({ BookButtonDisable: true });
    confirmEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        const temp_events = [...this.state.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        console.log(found_event_idx);
        if (success) {
          this.setState({
            isLoaded: true,
            isConfirmModalOpen: false,
            events: temp_events,
            event_temp: {},
            event_id: '',
            BookButtonDisable: false,
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            event_temp: {},
            event_id: '',
            BookButtonDisable: false,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          BookButtonDisable: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  handleEditAppointmentModal = (e, event_id, updated_event) => {
    e.preventDefault();
    this.setState({ BookButtonDisable: true });
    updateEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        const temp_events = [...this.state.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        if (success) {
          this.setState({
            isLoaded: true,
            isEditModalOpen: false,
            BookButtonDisable: false,
            events: temp_events,
            event_id: '',
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            BookButtonDisable: false,
            event_id: '',
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          BookButtonDisable: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  handleDeleteAppointmentModal = (e, event_id) => {
    e.preventDefault();
    this.setState({ BookButtonDisable: true });
    deleteEvent(event_id).then(
      (resp) => {
        const { data, agents, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            agents,
            hasEvents,
            events: data,
            event_id: '',
            BookButtonDisable: false,
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            event_id: '',
            BookButtonDisable: false,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          BookButtonDisable: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  handleModalBook = (e) => {
    e.preventDefault();
    this.setState({ BookButtonDisable: true });
    const eventWrapper = { ...this.state.selectedEvent };
    if (is_TaiGer_Student(this.props.user)) {
      eventWrapper.requester_id = this.props.user._id.toString();
      eventWrapper.description = this.state.newDescription;
      eventWrapper.receiver_id = this.state.newReceiver;
    }
    postEvent(eventWrapper).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        const events_temp = [...this.state.events];
        events_temp.push(data);
        if (success) {
          this.setState({
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            BookButtonDisable: false,
            selectedEvent: {},
            events: data,
            hasEvents: true,
            isDeleteModalOpen: false,
            res_modal_status: status
          });
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          this.setState({
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            BookButtonDisable: false,
            selectedEvent: {},
            isDeleteModalOpen: false,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        this.setState({
          success,
          isLoaded: true,
          newDescription: '',
          newReceiver: '',
          BookButtonDisable: false,
          selectedEvent: {},
          isDeleteModalOpen: false,
          res_modal_status: status
        });
      }
    );
  };

  handleUpdateDescription = (e) => {
    const new_description_temp = e.target.value;
    this.setState({
      event_temp: {
        ...this.state.event_temp,
        description: new_description_temp
      }
    });
  };

  handleUpdateTimeSlot = (e) => {
    const new_timeslot_temp = e.target.value;
    this.setState({
      event_temp: { ...this.state.event_temp, start: new_timeslot_temp }
    });
  };

  handleConfirmAppointmentModalClose = () => {
    this.setState({
      isConfirmModalOpen: false
    });
  };

  handleEditAppointmentModalClose = () => {
    this.setState({
      isEditModalOpen: false
    });
  };

  handleDeleteAppointmentModalClose = () => {
    this.setState({
      isDeleteModalOpen: false
    });
  };

  handleConfirmAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isConfirmModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    });
  };

  handleEditAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isEditModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    });
  };

  handleDeleteAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isDeleteModalOpen: true,
      event_id: event._id.toString()
    });
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  // Calendar handler:
  handleSelectEvent = (event) => {
    this.setState({
      selectedEvent: event
    });
  };
  handleChange = (e) => {
    const description_temp = e.target.value;
    this.setState({
      newDescription: description_temp
    });
  };
  handleModalClose = () => {
    this.setState({
      selectedEvent: {},
      newDescription: '',
      newReceiver: ''
    });
  };
  handleChangeReceiver = (e) => {
    const receiver_temp = e.target.value;
    this.setState({
      newReceiver: receiver_temp
    });
  };

  handleSelectSlot = (slotInfo) => {
    // When an empty date slot is clicked, open the modal to create a new event
    this.setState({
      newEventStart: slotInfo.start,
      newEventEnd: slotInfo.end,
      isNewEventModalOpen: true
    });
  };

  handleNewEventModalClose = () => {
    // Close the modal for creating a new event
    this.setState({
      isNewEventModalOpen: false,
      newEventTitle: '',
      newDescription: ''
    });
  };

  switchCalendarAndMyBookedEvents = () => {
    this.setState({
      hasEvents: !this.state.hasEvents
    });
  };

  render() {
    if (this.props.user.role !== 'Student') {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    const {
      hasEvents,
      events,
      agents,
      booked_events,
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

    const available_termins = [0, 1, 2, 3].flatMap((iter, x) =>
      agents.flatMap((agent, idx) =>
        getReorderWeekday(getTodayAsWeekday(agent.timezone)).flatMap(
          (weekday, i) => {
            const timeSlots =
              agent.officehours &&
              agent.officehours[weekday]?.active &&
              agent.officehours[weekday].time_slots.flatMap((time_slot, j) => {
                const { year, month, day } = getNextDayDate(
                  getReorderWeekday(getTodayAsWeekday(agent.timezone)),
                  weekday,
                  agent.timezone,
                  iter
                );
                const hour = parseInt(time_slot.value.split(':')[0], 10);
                const minutes = parseInt(time_slot.value.split(':')[1], 10);
                const time_difference =
                  getTimezoneOffset(
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                  ) - getTimezoneOffset(agent.timezone);
                // console.log(booked_events);
                // console.log(new Date(booked_events[0].start).toISOString());
                // console.log(
                //   shiftDateByOffset(
                //     new Date(year, month - 1, day, hour, minutes),
                //     time_difference
                //   ).toISOString()
                // );
                const condition = booked_events.some(
                  (booked_event) =>
                    new Date(booked_event.start).toISOString() ===
                    shiftDateByOffset(
                      new Date(year, month - 1, day, hour, minutes),
                      time_difference
                    ).toISOString()
                );
                if (condition) {
                  return [];
                } else {
                  return {
                    id: j * 10 + i * 100 + x * 1000 + 1,
                    title: `${(hour + time_difference) % 24}:${
                      time_slot.value.split(':')[1]
                    }`,
                    start: shiftDateByOffset(
                      new Date(year, month - 1, day, hour, minutes),
                      time_difference
                    ),
                    end: shiftDateByOffset(
                      new Date(year, month - 1, day, hour, minutes),
                      time_difference + 0.5
                    ),
                    provider: agent
                  };
                }
              });
            return timeSlots || [];
          }
        )
      )
    );

    const has_officehours = available_termins?.length !== 0 ? true : false;
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
            <Button onClick={this.switchCalendarAndMyBookedEvents}>
              To Calendar
            </Button>
            {events?.filter(
              (event) =>
                getNumberOfDays(new Date(), event.start) >= -1 &&
                (!event.isConfirmedReceiver || !event.isConfirmedRequester)
            ).length !== 0 &&
              events
                ?.filter(
                  (event) =>
                    getNumberOfDays(new Date(), event.start) >= -1 &&
                    (!event.isConfirmedReceiver || !event.isConfirmedRequester)
                )
                .map((event, i) => (
                  <EventConfirmationCard
                    key={i}
                    user={this.props.user}
                    event={event}
                    handleConfirmAppointmentModalOpen={
                      this.handleConfirmAppointmentModalOpen
                    }
                    handleEditAppointmentModalOpen={
                      this.handleEditAppointmentModalOpen
                    }
                    handleDeleteAppointmentModalOpen={
                      this.handleDeleteAppointmentModalOpen
                    }
                  />
                ))}
            <Card>
              <Card.Header>
                <Card.Title>Upcoming</Card.Title>
              </Card.Header>
              <Card.Body>
                {events?.filter(
                  (event) =>
                    getNumberOfDays(new Date(), event.start) >= -1 &&
                    event.isConfirmedReceiver &&
                    event.isConfirmedRequester
                ).length !== 0
                  ? events
                      ?.filter(
                        (event) =>
                          getNumberOfDays(new Date(), event.start) >= -1 &&
                          event.isConfirmedReceiver &&
                          event.isConfirmedRequester
                      )
                      .map((event, i) => (
                        <Card key={i}>
                          <Card.Header>
                            <Card.Title>
                              <AiOutlineCalendar /> Start:{' '}
                              {convertDate(event.start)} ~ 30 min
                            </Card.Title>
                          </Card.Header>
                          <Card.Body>
                            <AiOutlineUser size={16} />
                            Agent:{' '}
                            {event.receiver_id?.map((receiver, x) => (
                              <span key={x}>
                                {receiver.firstname} {receiver.lastname}{' '}
                                <AiOutlineMail ize={16} /> {receiver.email}
                              </span>
                            ))}
                            <br />
                            Description: {event.description}
                            <br />
                            Status:{' '}
                            {event.isConfirmedReceiver ? (
                              <AiFillCheckCircle
                                title="Confirmed"
                                size={16}
                                color="limegreen"
                              />
                            ) : (
                              <AiFillQuestionCircle
                                title="Waiting for confirmation"
                                size={16}
                                color="gray"
                              />
                            )}
                            <br />
                            Meeting Link:{' '}
                            {event.isConfirmedReceiver ? (
                              <a href={`${event.meetingLink}`}>
                                {event.meetingLink}
                              </a>
                            ) : (
                              'Will be available, after the appointment is confirmed by the Agent.'
                            )}
                            <br />
                            created at:{convertDate(event.createdAt)}
                            <br />
                            udpated at:{convertDate(event.updatedAt)}
                          </Card.Body>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) =>
                              this.handleEditAppointmentModalOpen(e, event)
                            }
                          >
                            <AiOutlineEdit size={16} /> Update
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) =>
                              this.handleDeleteAppointmentModalOpen(e, event)
                            }
                          >
                            <AiOutlineDelete size={16} /> Delete
                          </Button>
                        </Card>
                      ))
                  : 'No upcoming event'}
              </Card.Body>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Past</Card.Title>
              </Card.Header>
              <Card.Body>
                {events
                  ?.filter(
                    (event) => getNumberOfDays(new Date(), event.start) < -1
                  )
                  .map((event, i) => (
                    <Card key={i}>
                      <Card.Header>
                        <Card.Title>
                          <AiOutlineCalendar /> Start:{' '}
                          {convertDate(event.start)} ~ 30 min
                        </Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <AiOutlineUser size={16} /> Agent:{' '}
                        {event.receiver_id?.map((receiver, x) => (
                          <span key={x}>
                            {receiver.firstname} {receiver.lastname}{' '}
                            <AiOutlineMail ize={16} /> {receiver.email}
                          </span>
                        ))}
                        <br />
                        Description: {event.description}
                        <br />
                        Status:{' '}
                        {event.isConfirmedReceiver ? (
                          <AiFillCheckCircle
                            title="Confirmed"
                            size={16}
                            color="limegreen"
                          />
                        ) : (
                          <AiFillQuestionCircle
                            title="Waiting for confirmation"
                            size={16}
                            color="gray"
                          />
                        )}
                        <br />
                        Meeting Link:{' '}
                        {event.isConfirmedReceiver &&
                        event.isConfirmedRequester ? (
                          <a href={`${event.meetingLink}`}>
                            {event.meetingLink}
                          </a>
                        ) : (
                          'Will be available, after the appointment is confirmed by the Agent.'
                        )}
                        <br />
                        created at:{convertDate(event.createdAt)}
                        <br />
                        udpated at:{convertDate(event.updatedAt)}
                      </Card.Body>
                      <Button
                        variant="danger"
                        disabled
                        size="sm"
                        onClick={(e) =>
                          this.handleDeleteAppointmentModalOpen(e, event)
                        }
                      >
                        <AiOutlineDelete size={16} /> Delete
                      </Button>
                    </Card>
                  ))}
              </Card.Body>
            </Card>
            <Modal
              show={this.state.isConfirmModalOpen}
              onHide={this.handleConfirmAppointmentModalClose}
              centered
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                You are aware of this meeting time and confirm.
              </Modal.Body>
              <Modal.Footer>
                <Button
                  disabled={
                    this.state.event_id === '' ||
                    this.state.event_temp?.description?.length === 0 ||
                    this.state.BookButtonDisable
                  }
                  onClick={(e) =>
                    this.handleConfirmAppointmentModal(
                      e,
                      this.state.event_id,
                      this.state.event_temp
                    )
                  }
                >
                  {this.state.BookButtonDisable ? (
                    <Spinner
                      animation="border"
                      role="status"
                      variant="light"
                      size="sm"
                    >
                      <span className="visually-hidden"></span>
                    </Spinner>
                  ) : (
                    <>
                      <AiFillCheckCircle color="limegreen" size={16} /> Yes
                    </>
                  )}
                </Button>
                <Button
                  variant="light"
                  onClick={this.handleConfirmAppointmentModalClose}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={this.state.isEditModalOpen}
              onHide={this.handleEditAppointmentModalClose}
              centered
              size="lg"
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="my-0 mx-0">
                    <Form.Label>請寫下想討論的主題</Form.Label>
                    <Form.Control
                      as="textarea"
                      maxLength={2000}
                      rows="10"
                      placeholder="Example：我想定案選校、選課，我想討論簽證，德語班。"
                      value={this.state.event_temp.description || ''}
                      isInvalid={
                        this.state.event_temp.description?.length > 2000
                      }
                      onChange={(e) => this.handleUpdateDescription(e)}
                    ></Form.Control>
                    <Badge
                      className="mt-3"
                      bg={`${
                        this.state.event_temp.description?.length > 2000
                          ? 'danger'
                          : 'primary'
                      }`}
                    >
                      {this.state.event_temp.description?.length || 0}/{2000}
                    </Badge>
                  </Form.Group>
                </Form>
                <br />
                <Form>
                  <Form.Label>Time Slot</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => this.handleUpdateTimeSlot(e)}
                    value={new Date(this.state.event_temp.start)}
                  >
                    {available_termins
                      .sort((a, b) => (a.start < b.start ? -1 : 1))
                      .map((time_slot, j) => (
                        <option
                          value={`${time_slot.start}`}
                          key={`${time_slot.start}`}
                        >
                          {time_slot.start.toLocaleString()} to{' '}
                          {time_slot.end.toLocaleString()}
                        </option>
                      ))}
                  </Form.Control>
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  disabled={
                    this.state.event_id === '' ||
                    this.state.event_temp?.description?.length === 0 ||
                    this.state.BookButtonDisable
                  }
                  onClick={(e) =>
                    this.handleEditAppointmentModal(
                      e,
                      this.state.event_id,
                      this.state.event_temp
                    )
                  }
                >
                  {this.state.BookButtonDisable ? (
                    <Spinner
                      animation="border"
                      role="status"
                      variant="light"
                      size="sm"
                    >
                      <span className="visually-hidden"></span>
                    </Spinner>
                  ) : (
                    'Update'
                  )}
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={this.state.isDeleteModalOpen}
              onHide={this.handleDeleteAppointmentModalClose}
              centered
              size="lg"
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>Do you want to cancel this meeting?</Modal.Body>
              <Modal.Footer>
                <Button
                  disabled={
                    this.state.event_id === '' || this.state.BookButtonDisable
                  }
                  onClick={(e) =>
                    this.handleDeleteAppointmentModal(e, this.state.event_id)
                  }
                >
                  {this.state.BookButtonDisable ? (
                    <Spinner
                      animation="border"
                      role="status"
                      variant="light"
                      size="sm"
                    >
                      <span className="visually-hidden"></span>
                    </Spinner>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          <>
            <Button onClick={this.switchCalendarAndMyBookedEvents}>
              My Appointments
            </Button>
            <Row>
              <Col>
                <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
                  <Card.Header>
                    <Card.Title className="my-0 mx-0 text-light">
                      Office Hours
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <h5 className="text-light">Note</h5>
                      <p className="text-light">
                        請一次只能約一個時段。為了有效率的討論，請詳述您的問題，並讓
                        Agent 有時間消化。
                      </p>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Card>
              <Card.Body>
                <Tabs
                  defaultActiveKey={'Calendar'}
                  id="Calendar-example"
                  fill={true}
                  justify={true}
                  className="py-0 my-0 mx-0"
                >
                  <Tab eventKey="Calendar" title="Calendar">
                    {/* {'Only boo'} */}
                    {events?.filter(
                      (event) => getNumberOfDays(new Date(), event.start) >= -1
                    ).length !== 0 && (
                      <Banner
                        ReadOnlyMode={true}
                        bg={'primary'}
                        title={'Info:'}
                        path={'/'}
                        text={
                          <>在您目前預定的時段過後，您將可以再次預約時段。</>
                        }
                        link_name={''}
                        removeBanner={(a, b) => {}}
                        notification_key={'x'}
                      />
                    )}
                    {!has_officehours && (
                      <Banner
                        ReadOnlyMode={true}
                        bg={'primary'}
                        title={'Info:'}
                        path={'/'}
                        text={
                          <>
                            目前 Agent 無空出 Office hours 時段，請聯繫您的
                            Agent。
                          </>
                        }
                        link_name={''}
                        removeBanner={(a, b) => {}}
                        notification_key={'x'}
                      />
                    )}
                    <MyCalendar
                      events={
                        // events?.filter(
                        //   (event) =>
                        //     getNumberOfDays(new Date(), event.start) >= -1
                        // ).length !== 0
                        //   ? []
                        //   :
                        [...available_termins]
                      }
                      user={this.props.user}
                      handleSelectEvent={this.handleSelectEvent}
                      handleChange={this.handleChange}
                      handleModalClose={this.handleModalClose}
                      handleChangeReceiver={this.handleChangeReceiver}
                      handleSelectSlot={this.handleSelectSlot}
                      handleNewEventModalClose={this.handleNewEventModalClose}
                      handleModalBook={this.handleModalBook}
                      BookButtonDisable={this.state.BookButtonDisable}
                      newReceiver={this.state.newReceiver}
                      newDescription={this.state.newDescription}
                      selectedEvent={this.state.selectedEvent}
                      newEventStart={this.state.newEventStart}
                      newEventEnd={this.state.newEventEnd}
                      newEventTitle={this.state.newEventTitle}
                      isNewEventModalOpen={this.state.isNewEventModalOpen}
                    />
                  </Tab>
                  <Tab eventKey="Appointment" title="Appointment">
                    {available_termins
                      .sort((a, b) => (a.start < b.start ? -1 : 1))
                      .map((time_slot, j) => (
                        <Card key={j} className="my-0 mx-0">
                          <Card.Header>
                            <Card.Title>
                              {time_slot.start.toLocaleString()} to{' '}
                              {time_slot.end.toLocaleString()}
                            </Card.Title>
                          </Card.Header>
                        </Card>
                      ))}
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </>
        )}
      </Aux>
    );
  }
}

export default OfficeHours;
