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
  getTimezoneOffset,
  convertDate
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { deleteEvent, getEvents, postEvent, updateEvent } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import { is_TaiGer_Student } from '../Utils/checking-functions';

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
    isDeleteModalOpen: false,
    event_id: '',
    selectedEvent: {},
    newReceiver: '',
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
  }

  handleUpdateAppointmentModal = (e, event_id, updated_event) => {
    updateEvent(event_id, updated_event).then(
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
  };

  handleDeleteAppointmentModal = (e, event_id) => {
    deleteEvent(event_id).then(
      (resp) => {
        const { data, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            agent: data,
            hasEvents,
            event_id: '',
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
          res_status: 500
        }));
      }
    );
  };

  handleModalBook = () => {
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
        if (success) {
          this.setState({
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            selectedEvent: {},
            events: data,
            hasEvents: true,
            isDeleteModalOpen: false,
            res_modal_status: status
          });
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setGeneralState({
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
          setNewDescription('');
          setSelectedEvent({});
        }
      },
      (error) => {
        setSelectedEvent({});
      }
    );
  };

  handleDeleteAppointmentModalClose = () => {
    this.setState({
      isDeleteModalOpen: false
    });
  };

  handleDeleteAppointmentModalOpen = (e, event) => {
    e.preventDefault();
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
    // const getReorderWeekday(getTodayAsWeekday(agent.timezone)) = getReorderWeekday(
    //   getTodayAsWeekday(this.state.agent.timezone)
    // );
    const agents = this.state.agent;
    const available_termins = [0, 1, 2, 3].flatMap((iter, x) =>
      agents.flatMap((agent, idx) =>
        getReorderWeekday(getTodayAsWeekday(agent.timezone)).flatMap(
          (weekday, i) => {
            const timeSlots =
              agent.officehours &&
              agent.officehours[weekday]?.active &&
              agent.officehours[weekday].time_slots
                // .sort((a, b) => (a.value < b.value ? -1 : 1))
                .flatMap((time_slot, j) => {
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
                });
            return timeSlots || [];
          }
        )
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
              <Card key={i}>
                <Card.Header>
                  <Card.Title></Card.Title>
                </Card.Header>
                {event.receiver_id?.map((receiver, x) => (
                  <span key={x}>
                    {receiver.firstname} {receiver.lastname} {receiver.email}
                  </span>
                ))}
                <br />
                Description: {event.description}
                <br />
                Confirmed: {event.isConfirmed ? 'true' : 'false'}
                <br />
                Title: {event.title}
                <br />
                Start: {convertDate(event.start)}
                <br />
                End: {convertDate(event.end)}
                <br />
                created at:{convertDate(event.createdAt)}
                <br />
                udpated at:{convertDate(event.updatedAt)}
                <Button variant="secondary">Update</Button>
                <Button
                  variant="danger"
                  onClick={(e) =>
                    this.handleDeleteAppointmentModalOpen(e, event)
                  }
                >
                  Delete
                </Button>
              </Card>
            ))}
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
                  disabled={this.state.event_id === ''}
                  onClick={(e) =>
                    this.handleDeleteAppointmentModal(e, this.state.event_id)
                  }
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          <>
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
                    <MyCalendar
                      events={[...available_termins]}
                      user={this.props.user}
                      handleSelectEvent={this.handleSelectEvent}
                      handleChange={this.handleChange}
                      handleModalClose={this.handleModalClose}
                      handleChangeReceiver={this.handleChangeReceiver}
                      handleSelectSlot={this.handleSelectSlot}
                      handleNewEventModalClose={this.handleNewEventModalClose}
                      handleModalBook={this.handleModalBook}
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
