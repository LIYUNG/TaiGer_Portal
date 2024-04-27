import { useEffect, useState } from 'react';
import {
  confirmEvent,
  deleteEvent,
  getEvents,
  postEvent,
  updateEvent
} from '../api';
import { is_TaiGer_Student } from '../Demo/Utils/checking-functions';
import { useAuth } from '../components/AuthProvider';

function useCalendarEvents(props) {
  const { user } = useAuth();
  const [calendarEventsState, setCalendarEventsState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    agents: {},
    hasEvents: false,
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
  });

  useEffect(() => {
    getEvents().then(
      (resp) => {
        const { data, agents, booked_events, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          setCalendarEventsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            agents,
            hasEvents,
            events: data,
            booked_events,
            success: success,
            res_status: status
          }));
        } else {
          setCalendarEventsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setCalendarEventsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [props.user_id]);

  const handleModalBook = (e) => {
    e.preventDefault();
    setCalendarEventsState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    const eventWrapper = { ...calendarEventsState.selectedEvent };
    if (is_TaiGer_Student(user)) {
      eventWrapper.requester_id = user._id.toString();
      eventWrapper.description = calendarEventsState.newDescription;
      eventWrapper.receiver_id = calendarEventsState.newReceiver;
    }
    postEvent(eventWrapper).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        const events_temp = [...calendarEventsState.events];
        events_temp.push(data);
        if (success) {
          setCalendarEventsState((prevState) => ({
            ...prevState,
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
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setCalendarEventsState((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            BookButtonDisable: false,
            selectedEvent: {},
            isDeleteModalOpen: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCalendarEventsState((prevState) => ({
          ...prevState,
          error,
          isLoaded: true,
          newDescription: '',
          newReceiver: '',
          BookButtonDisable: false,
          selectedEvent: {},
          isDeleteModalOpen: false,
          res_modal_status: status
        }));
      }
    );
  };

  const handleConfirmAppointmentModal = (e, event_id, updated_event) => {
    e.preventDefault();
    setCalendarEventsState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    confirmEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        const temp_events = [...calendarEventsState.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        if (success) {
          setCalendarEventsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isConfirmModalOpen: false,
            events: temp_events,
            event_temp: {},
            event_id: '',
            BookButtonDisable: false,
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          }));
        } else {
          setCalendarEventsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            event_temp: {},
            event_id: '',
            BookButtonDisable: false,
            res_status: status
          }));
        }
      },
      (error) => {
        setCalendarEventsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          BookButtonDisable: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  const handleEditAppointmentModal = (e, event_id, updated_event) => {
    e.preventDefault();
    setCalendarEventsState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    updateEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        const temp_events = [...calendarEventsState.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        if (success) {
          setCalendarEventsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isEditModalOpen: false,
            BookButtonDisable: false,
            events: temp_events,
            event_id: '',
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          }));
        } else {
          setCalendarEventsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            BookButtonDisable: false,
            event_id: '',
            res_status: status
          }));
        }
      },
      (error) => {
        setCalendarEventsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          BookButtonDisable: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  const handleDeleteAppointmentModal = (e, event_id) => {
    e.preventDefault();
    setCalendarEventsState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    deleteEvent(event_id).then(
      (resp) => {
        const { data, agents, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          setCalendarEventsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            agents,
            hasEvents,
            events: data,
            event_id: '',
            BookButtonDisable: false,
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          }));
        } else {
          setCalendarEventsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            event_id: '',
            BookButtonDisable: false,
            res_status: status
          }));
        }
      },
      (error) => {
        setCalendarEventsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          BookButtonDisable: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  const handleConfirmAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setCalendarEventsState((prevState) => ({
      ...prevState,
      isConfirmModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
  };

  const handleEditAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setCalendarEventsState((prevState) => ({
      ...prevState,
      isEditModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
  };

  const handleUpdateDescription = (e) => {
    const new_description_temp = e.target.value;
    setCalendarEventsState((prevState) => ({
      ...prevState,
      event_temp: {
        ...prevState.event_temp,
        description: new_description_temp
      }
    }));
  };

  const handleUpdateTimeSlot = (e) => {
    const new_timeslot_temp = e.target.value;
    setCalendarEventsState((prevState) => ({
      ...prevState,
      event_temp: { ...prevState.event_temp, start: new_timeslot_temp }
    }));
  };

  const handleConfirmAppointmentModalClose = () => {
    setCalendarEventsState((prevState) => ({
      ...prevState,
      isConfirmModalOpen: false
    }));
  };

  const handleEditAppointmentModalClose = () => {
    setCalendarEventsState((prevState) => ({
      ...prevState,
      isEditModalOpen: false
    }));
  };

  const handleDeleteAppointmentModalClose = () => {
    setCalendarEventsState((prevState) => ({
      ...prevState,
      isDeleteModalOpen: false
    }));
  };

  const handleDeleteAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setCalendarEventsState((prevState) => ({
      ...prevState,
      isDeleteModalOpen: true,
      event_id: event._id.toString()
    }));
  };

  const handleModalClose = () => {
    setCalendarEventsState((prevState) => ({
      ...prevState,
      selectedEvent: {},
      newDescription: '',
      newReceiver: ''
    }));
  };

  const handleChangeReceiver = (e) => {
    const receiver_temp = e.target.value;
    setCalendarEventsState((prevState) => ({
      ...prevState,
      newReceiver: receiver_temp
    }));
  };

  // Calendar handler:
  const handleSelectEvent = (event) => {
    setCalendarEventsState((prevState) => ({
      ...prevState,
      selectedEvent: event
    }));
  };
  const handleChange = (e) => {
    const description_temp = e.target.value;
    setCalendarEventsState((prevState) => ({
      ...prevState,
      newDescription: description_temp
    }));
  };

  const handleSelectSlot = (slotInfo) => {
    // When an empty date slot is clicked, open the modal to create a new event
    setCalendarEventsState((prevState) => ({
      ...prevState,
      newEventStart: slotInfo.start,
      newEventEnd: slotInfo.end,
      isNewEventModalOpen: true
    }));
  };

  const handleNewEventModalClose = () => {
    // Close the modal for creating a new event
    setCalendarEventsState((prevState) => ({
      ...prevState,
      isNewEventModalOpen: false,
      newEventTitle: '',
      newDescription: ''
    }));
  };

  const switchCalendarAndMyBookedEvents = () => {
    setCalendarEventsState((prevState) => ({
      ...prevState,
      hasEvents: !prevState.hasEvents
    }));
  };

  const ConfirmError = () => {
    setCalendarEventsState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  return {
    events: calendarEventsState.events,
    agents: calendarEventsState.agents,
    hasEvents: calendarEventsState.hasEvents,
    booked_events: calendarEventsState.booked_events,
    isLoaded: calendarEventsState.isLoaded,
    res_status: calendarEventsState.res_status,
    isConfirmModalOpen: calendarEventsState.isConfirmModalOpen,
    event_id: calendarEventsState.event_id,
    event_temp: calendarEventsState.event_temp,
    BookButtonDisable: calendarEventsState.BookButtonDisable,
    isEditModalOpen: calendarEventsState.isEditModalOpen,
    newReceiver: calendarEventsState.newReceiver,
    newDescription: calendarEventsState.newDescription,
    selectedEvent: calendarEventsState.selectedEvent,
    newEventStart: calendarEventsState.newEventStart,
    newEventEnd: calendarEventsState.newEventEnd,
    newEventTitle: calendarEventsState.newEventTitle,
    isNewEventModalOpen: calendarEventsState.isNewEventModalOpen,
    isDeleteModalOpen: calendarEventsState.isDeleteModalOpen,
    handleConfirmAppointmentModalOpen: handleConfirmAppointmentModalOpen,
    handleEditAppointmentModalOpen: handleEditAppointmentModalOpen,
    handleModalBook: handleModalBook,
    handleUpdateDescription: handleUpdateDescription,
    handleEditAppointmentModal: handleEditAppointmentModal,
    handleConfirmAppointmentModal: handleConfirmAppointmentModal,
    handleDeleteAppointmentModal: handleDeleteAppointmentModal,
    handleUpdateTimeSlot: handleUpdateTimeSlot,
    handleConfirmAppointmentModalClose: handleConfirmAppointmentModalClose,
    handleEditAppointmentModalClose: handleEditAppointmentModalClose,
    handleDeleteAppointmentModalClose: handleDeleteAppointmentModalClose,
    handleDeleteAppointmentModalOpen: handleDeleteAppointmentModalOpen,
    handleModalClose: handleModalClose,
    handleChangeReceiver: handleChangeReceiver,
    handleSelectEvent: handleSelectEvent,
    handleChange: handleChange,
    handleSelectSlot: handleSelectSlot,
    handleNewEventModalClose: handleNewEventModalClose,
    switchCalendarAndMyBookedEvents: switchCalendarAndMyBookedEvents,
    res_modal_message: calendarEventsState.res_modal_message,
    res_modal_status: calendarEventsState.res_modal_status,
    ConfirmError
  };
}

export default useCalendarEvents;
