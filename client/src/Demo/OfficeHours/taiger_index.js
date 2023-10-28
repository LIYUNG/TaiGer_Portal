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
  getTimezoneOffset,
  isInTheFuture,
  getUTCWithDST
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import {
  confirmEvent,
  deleteEvent,
  getEvents,
  postEvent,
  updateEvent
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import {
  is_TaiGer_Agent,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import { AiFillCheckCircle } from 'react-icons/ai';
import EventConfirmationCard from '../../components/Calendar/components/EventConfirmationCard';
import { Redirect } from 'react-router-dom';
import DEMO from '../../store/constant';
import moment from 'moment-timezone';

class TaiGerOfficeHours extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    agents: {},
    hasEvents: false,
    students: null,
    student_id: '',
    updateconfirmed: false,
    updatecredentialconfirmed: false,
    isDeleteModalOpen: false,
    isEditModalOpen: false,
    isConfirmModalOpen: false,
    event_temp: {},
    event_id: '',
    BookButtonDisable: false,
    selectedEvent: {},
    newReceiver: '',
    newDescription: '',
    newEventTitle: '',
    newEventStart: null,
    newEventEnd: null,
    isNewEventModalOpen: false,
    selected_year: 0,
    selected_month: 0,
    selected_day: 0,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getEvents(this.props.match.params.user_id).then(
      (resp) => {
        const { data, agents, hasEvents, students, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            agents,
            hasEvents,
            events: data,
            students,
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
          const { data, agents, hasEvents, students, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              agents,
              hasEvents,
              events: data,
              students,
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
          error,
          BookButtonDisable: false,
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
        let temp_events = [...this.state.events];
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
          error,
          BookButtonDisable: false,
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
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          BookButtonDisable: false,
          res_status: 500
        }));
      }
    );
  };

  handleModalBook = (e) => {
    const eventWrapper = { ...this.state.selectedEvent };
    if (is_TaiGer_Student(this.props.user)) {
      eventWrapper.requester_id = this.props.user._id.toString();
      eventWrapper.description = this.state.newDescription;
      eventWrapper.receiver_id = this.state.newReceiver;
    }
    e.preventDefault();
    this.setState({ BookButtonDisable: true });
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
            selectedEvent: {},
            events: data,
            BookButtonDisable: false,
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
            selectedEvent: {},
            isDeleteModalOpen: false,
            BookButtonDisable: false,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        this.setState({
          success,
          error,
          isLoaded: true,
          newDescription: '',
          newReceiver: '',
          selectedEvent: {},
          isDeleteModalOpen: false,
          BookButtonDisable: false
        });
      }
    );
  };

  // Only Agent can request
  handleModalCreateEvent = (newEvent) => {
    const eventWrapper = { ...newEvent };
    if (is_TaiGer_Agent(this.props.user)) {
      const temp_std = this.state.students.find(
        (std) => std._id.toString() === this.state.student_id
      );
      eventWrapper.title = `${temp_std.firstname} ${temp_std.lastname} ${temp_std.firstname_chinese} ${temp_std.lastname_chinese}`;
      eventWrapper.requester_id = this.state.student_id;
      eventWrapper.receiver_id = this.props.user._id.toString();
    }
    // e.preventDefault();
    this.setState({ BookButtonDisable: true });
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
            selectedEvent: {},
            student_id: '',
            isNewEventModalOpen: false,
            events: data,
            newEvent: {},
            BookButtonDisable: false,
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
            selectedEvent: {},
            isNewEventModalOpen: false,
            isDeleteModalOpen: false,
            BookButtonDisable: false,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        this.setState({
          success,
          error,
          isLoaded: true,
          newDescription: '',
          newReceiver: '',
          isNewEventModalOpen: false,
          selectedEvent: {},
          isDeleteModalOpen: false,
          BookButtonDisable: false
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
      event_temp: { ...this.state.event_temp, start: new_timeslot_temp },
      newEventStart: new_timeslot_temp
    });
  };

  handleSelectStudent = (e) => {
    const student_id = e.target.value;
    this.setState({
      student_id: student_id
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
      isEditModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
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
    const Some_Date = new Date(slotInfo.start); //bug
    const year = Some_Date.getFullYear();
    const month = Some_Date.getMonth() + 1;
    const day = Some_Date.getDate();

    this.setState({
      newEventStart: slotInfo.start,
      newEventEnd: slotInfo.end,
      isNewEventModalOpen: true,
      selected_year: year,
      selected_month: month,
      selected_day: day
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
    if (this.props.user.role !== 'Agent') {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    const {
      hasEvents,
      events,
      agents,
      students,
      res_status,
      isLoaded,
      res_modal_status,
      res_modal_message
    } = this.state;

    if (!isLoaded || !students) {
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

    let available_termins = [];
    available_termins = [0, 1, 2, 3, 4, 5].flatMap((iter, x) =>
      agents.flatMap((agent, idx) =>
        agent.timezone && moment.tz.zone(agent.timezone)
          ? getReorderWeekday(getTodayAsWeekday(agent.timezone)).flatMap(
              (weekday, i) => {
                const timeSlots =
                  agent.officehours &&
                  agent.officehours[weekday]?.active &&
                  agent.officehours[weekday].time_slots.flatMap(
                    (time_slot, j) => {
                      const { year, month, day } = getNextDayDate(
                        getReorderWeekday(getTodayAsWeekday(agent.timezone)),
                        weekday,
                        agent.timezone,
                        iter
                      );
                      const test_date = getUTCWithDST(
                        year,
                        month,
                        day,
                        agent.timezone,
                        time_slot.value
                      );
                      // console.log(test_date); // TODO in case timezone not defined?
                      const hour = parseInt(time_slot.value.split(':')[0], 10);
                      const minutes = parseInt(
                        time_slot.value.split(':')[1],
                        10
                      );
                      const time_difference = // TODO: dynamics offset based on winter time
                        getTimezoneOffset(
                          Intl.DateTimeFormat().resolvedOptions().timeZone
                        ) - getTimezoneOffset(agent.timezone);
                      const end_date = new Date(test_date);
                      end_date.setMinutes(end_date.getMinutes() + 30);
                      return {
                        id: j * 10 + i * 100 + x * 1000 + 1,
                        title: `${new Date(test_date)}`,
                        start: new Date(test_date),
                        end: end_date,
                        provider: agent
                      };
                    }
                  );
                return timeSlots || [];
              }
            )
          : []
      )
    );
    const booked_events = events.map((event, idx) => ({
      ...event,
      id: event._id.toString(),
      start: new Date(event.start),
      end: new Date(event.end),
      provider: event.requester_id[0]
    }));
    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row className="sticky-top">
          <Col>
            <Card className="mb-2 mx-0" bg={'primary'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  My Events
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        {hasEvents ? (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={this.switchCalendarAndMyBookedEvents}
            >
              To Calendar
            </Button>
            {events?.filter(
              (event) =>
                isInTheFuture(event.end) &&
                (!event.isConfirmedReceiver || !event.isConfirmedRequester)
            ).length !== 0 &&
              events
                ?.filter(
                  (event) =>
                    isInTheFuture(event.end) &&
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
                <Card.Title as="h5">Upcoming</Card.Title>
              </Card.Header>
              <Card.Body>
                {events?.filter(
                  (event) =>
                    isInTheFuture(event.end) &&
                    event.isConfirmedRequester &&
                    event.isConfirmedReceiver
                ).length !== 0
                  ? events
                      ?.filter(
                        (event) =>
                          isInTheFuture(event.end) &&
                          event.isConfirmedRequester &&
                          event.isConfirmedReceiver
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
                  ?.filter((event) => !isInTheFuture(event.end))
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
                      disabled={true}
                    />
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
                    <MyCalendar
                      events={[...booked_events]}
                      user={this.props.user}
                      handleSelectEvent={this.handleSelectEvent}
                      handleUpdateTimeSlot={this.handleUpdateTimeSlot}
                      handleChange={this.handleChange}
                      handleModalClose={this.handleModalClose}
                      handleChangeReceiver={this.handleChangeReceiver}
                      handleSelectSlot={this.handleSelectSlot}
                      handleSelectStudent={this.handleSelectStudent}
                      student_id={this.state.student_id}
                      handleNewEventModalClose={this.handleNewEventModalClose}
                      handleModalBook={this.handleModalBook}
                      handleModalCreateEvent={this.handleModalCreateEvent}
                      newReceiver={this.state.newReceiver}
                      newDescription={this.state.newDescription}
                      selectedEvent={this.state.selectedEvent}
                      newEventStart={this.state.newEventStart}
                      newEventEnd={this.state.newEventEnd}
                      newEventTitle={this.state.newEventTitle}
                      selected_year={this.state.selected_year}
                      selected_month={this.state.selected_month}
                      selected_day={this.state.selected_day}
                      students={this.state.students}
                      isNewEventModalOpen={this.state.isNewEventModalOpen}
                    />
                  </Tab>
                  <Tab eventKey="Appointment" title="Appointment">
                    {booked_events
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
        <Modal
          show={this.state.isEditModalOpen}
          onHide={this.handleEditAppointmentModalClose}
          centered
          size="lg"
        >
          <Modal.Header closeButton>Edit</Modal.Header>
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
                  isInvalid={this.state.event_temp.description?.length > 2000}
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
            <p>
              Student:{' '}
              {this.state.event_temp?.requester_id?.map((requester, idx) => (
                <p key={idx}>
                  {requester.firstname} {requester.lastname}
                </p>
              ))}
            </p>
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
      </Aux>
    );
  }
}

export default TaiGerOfficeHours;
