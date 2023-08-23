import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popping from './Popping';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { convertDate, stringToColor } from '../../../Demo/Utils/contants';
import {
  is_TaiGer_Agent,
  is_TaiGer_Student
} from '../../../Demo/Utils/checking-functions';
import { postEvent } from '../../../api';

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const [generalState, setGeneralState] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventStart, setNewEventStart] = useState(null); // Initialize start
  const [newEventEnd, setNewEventEnd] = useState(null); // Initialize end
  const [newDescription, setNewDescription] = useState(''); // Initialize end
  const [newReceiver, setNewReceiver] = useState(''); // Initialize end

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };
  const handleChange = (e) => {
    const description_temp = e.target.value;
    setNewDescription(description_temp);
  };
  const handleChangeReceiver = (e) => {
    const receiver_temp = e.target.value;
    setNewReceiver(receiver_temp);
  };
  const handleModalClose = () => {
    setNewReceiver('');
    setNewDescription('');
    setSelectedEvent({});
  };
  const handleModalBook = () => {
    const eventWrapper = { ...selectedEvent };
    if (is_TaiGer_Student(props.user)) {
      eventWrapper.requester_id = props.user._id.toString();
      eventWrapper.description = newDescription;
      eventWrapper.receiver_id = newReceiver;
    }
    postEvent(eventWrapper).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          setGeneralState({
            success,
            isLoaded: true,
            res_modal_status: status
          });
          setNewDescription('');
          setNewReceiver('');
          setSelectedEvent({});
          props.handlePostEvent(data);
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
  const handleSelectSlot = (slotInfo) => {
    // When an empty date slot is clicked, open the modal to create a new event
    setNewEventStart(slotInfo.start); // Set the initial start value for the new event
    setNewEventEnd(slotInfo.end); // Set the initial end value for the new event
    setIsNewEventModalOpen(true);
  };

  const handleNewEventModalClose = () => {
    // Close the modal for creating a new event
    setIsNewEventModalOpen(false);
    setNewEventTitle('');
    setNewEventDescription('');
  };

  const handleCreateEvent = () => {
    // Create a new event object and add it to the events array
    const newEvent = {
      id: props.events?.length + 1,
      title: newEventTitle,
      start: selectedEvent.start,
      end: selectedEvent.end,
      description: newEventDescription
    };
    const updatedEvents = [...props.events, newEvent];
    // setEvents(updatedEvents);
    handleNewEventModalClose();
  };

  const eventPropGetter = (event) => {
    // Default background color for other events
    return {
      style: {
        backgroundColor: stringToColor(
          `${event.provider.firstname} ${event.provider.lastname}`
        ) // Set a fallback background color for other events
      }
    };
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={props.events}
        style={{ height: 600 }}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        defaultView="month" // Set the default view to "month"
        // Using the eventPropGetter to customize event rendering
        // eventPropGetter={(event) => {
        //   return {
        //     style: {
        //       // You can add custom styles for each event here
        //       backgroundColor: '#3174ad',
        //       color: '#fff'
        //     }
        //   };
        // }}
        // Using the popup to show event details
        popup
        // Rendering additional event information in the popup
        components={{
          event: ({ event }) => (
            <span>
              {event.title} - {event.description}
            </span>
          )
        }}
        // Set the timeslots and step using the custom function
        timeslots={2}
        selectable={true}
        // Handle event click to show the modal
        onSelectEvent={handleSelectEvent}
        onSelectSlot={is_TaiGer_Agent(props.user) ? handleSelectSlot : () => {}}
        eventPropGetter={eventPropGetter} // Apply custom styles to events based on the logic
        // onSelectSlot={() => console.log('Triggered!')}
      />
      {/* Modal */}

      <Popping
        open={selectedEvent}
        handleClose={handleModalClose}
        handleBook={handleModalBook}
        handleChange={handleChange}
        handleChangeReceiver={handleChangeReceiver}
        newReceiver={newReceiver}
        newDescription={newDescription}
        // renderStatus={renderStatus}
        // rerender={rerender}
        event={selectedEvent}
        user={props.user}
      />

      {/* Modal for creating a new event */}
      {/* React Bootstrap Modal for creating a new event */}

      <Modal
        show={isNewEventModalOpen}
        onHide={handleNewEventModalClose}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="event_title" className="mb-4">
              <Form.Control
                type="text"
                placeholder="Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows="5"
                onChange={(e) => setNewEventDescription(e.target.value)}
                value={newEventDescription}
                placeholder="Description"
              />
            </Form.Group>
          </Form>
          {convertDate(newEventStart)}
          {convertDate(newEventEnd)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateEvent}>
            Create
          </Button>
          <Button variant="secondary" onClick={handleNewEventModalClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyCalendar;
