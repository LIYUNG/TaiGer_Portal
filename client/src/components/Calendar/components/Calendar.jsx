import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popping from './Popping';
import { Button, Form, Modal } from 'react-bootstrap';
import { convertDate, stringToColor } from '../../../Demo/Utils/contants';
import {
  is_TaiGer_Agent,
  is_TaiGer_Student
} from '../../../Demo/Utils/checking-functions';

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const [generalState, setGeneralState] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({});
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

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
    props.handleNewEventModalClose();
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
        onSelectEvent={props.handleSelectEvent}
        onSelectSlot={
          is_TaiGer_Agent(props.user) ? props.handleSelectSlot : () => {}
        }
        eventPropGetter={eventPropGetter} // Apply custom styles to events based on the logic
        // onSelectSlot={() => console.log('Triggered!')}
      />
      {/* Modal */}
      {/* {is_TaiGer_Student(props.user) && ( */}
      <Popping
        open={props.selectedEvent}
        handleClose={props.handleModalClose}
        handleBook={props.handleModalBook}
        handleChange={props.handleChange}
        handleChangeReceiver={props.handleChangeReceiver}
        newReceiver={props.newReceiver}
        BookButtonDisable={props.BookButtonDisable}
        newDescription={props.newDescription}
        event={props.selectedEvent}
        user={props.user}
      />
      {/* )} */}

      {/* Modal for creating a new event */}
      {/* React Bootstrap Modal for creating a new event */}

      <Modal
        show={isNewEventModalOpen}
        onHide={props.handleNewEventModalClose}
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
          {convertDate(props.newEventStart)}
          {convertDate(props.newEventEnd)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateEvent}>
            Create
          </Button>
          <Button variant="secondary" onClick={props.handleNewEventModalClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyCalendar;
