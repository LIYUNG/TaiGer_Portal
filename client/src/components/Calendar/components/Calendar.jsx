import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popping from './Popping';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { convertDate } from '../../../Demo/Utils/contants';

const locales = {
  'en-US': enUS
};

const localizer = momentLocalizer(moment);

const events = [
  {
    id: 1,
    title: 'Meeting 1',
    start: new Date(2023, 6, 24, 10, 0),
    end: new Date(2023, 6, 24, 11, 30),
    description: 'This is the first meeting description.'
  },
  {
    id: 3,
    title: 'Meeting 1',
    start: new Date(2023, 6, 24, 10, 0),
    end: new Date(2023, 6, 24, 11, 30),
    description: 'This is the first meeting description.'
  },
  {
    id: 6,
    title: 'Meeting 1',
    start: new Date(2023, 6, 24, 10, 0),
    end: new Date(2023, 6, 24, 11, 30),
    description: 'This is the first meeting description.'
  },
  {
    id: 7,
    title: 'Meeting 2',
    start: new Date(2023, 6, 25, 14, 0),
    end: new Date(2023, 6, 25, 16, 0),
    description: 'This is the second meeting description.'
  }
];

const MyCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventStart, setNewEventStart] = useState(null); // Initialize start
  const [newEventEnd, setNewEventEnd] = useState(null); // Initialize end

  const handleSelectEvent = (event) => {
    // console.log(event);
    setSelectedEvent(event);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
  };

  const handleSelectSlot = (slotInfo) => {
    // When an empty date slot is clicked, open the modal to create a new event
    // setSelectedEvent({ start, end });
    const isDisabled = disabledTimeslots.some(
      (timeslot) =>
        (slotInfo.start >= timeslot.start && slotInfo.end <= timeslot.end) ||
        (slotInfo.start <= timeslot.start && slotInfo.end >= timeslot.end) ||
        (slotInfo.start <= timeslot.start && slotInfo.end > timeslot.start) ||
        (slotInfo.start < timeslot.end && slotInfo.end >= timeslot.end)
    );

    // If the slot is disabled, prevent any further action
    if (isDisabled) {
      return;
    }
    setNewEventStart(slotInfo.start); // Set the initial start value for the new event
    setNewEventEnd(slotInfo.end); // Set the initial end value for the new event

    // console.log('Clicked!');
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
      id: events.length + 1,
      title: newEventTitle,
      start: selectedEvent.start,
      end: selectedEvent.end,
      description: newEventDescription
    };
    const updatedEvents = [...events, newEvent];
    // setEvents(updatedEvents);
    handleNewEventModalClose();
  };

  const disabledTimeslots = [
    // An array of objects representing the start and end times of disabled slots
    {
      start: new Date(2023, 6, 24, 13, 0),
      end: new Date(2023, 6, 24, 14, 0)
    },
    { start: new Date(2023, 6, 25, 9, 0), end: new Date(2023, 6, 25, 11, 0) }
    // Add more disabled timeslots as needed
  ];

  const slotPropGetter = (date) => {
    // Check if the current slot is within any of the disabled timeslots
    const isDisabled = disabledTimeslots.some(
      (timeslot) => date >= timeslot.start && date < timeslot.end
    );

    // If the slot is disabled, return custom styles to make it visually inactive
    if (isDisabled) {
      return {
        style: {
          backgroundColor: '#f2f2f2', // A color to indicate the inactive state
          pointerEvents: 'none' // Disable pointer events to prevent selection
        }
      };
    }

    // Otherwise, return null to use the default slot style
    return null;
  };
  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        style={{ height: 500 }}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        defaultView="month" // Set the default view to "month"
        // Using the eventPropGetter to customize event rendering
        slotPropGetter={slotPropGetter} // Apply custom styles to slots based on the logic
        eventPropGetter={(event) => {
          return {
            style: {
              // You can add custom styles for each event here
              backgroundColor: '#3174ad',
              color: '#fff'
            }
          };
        }}
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
        selectable={true}
        // Handle event click to show the modal
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        // onSelectSlot={() => console.log('Triggered!')}
      />
      {/* Modal */}
      {selectedEvent && (
        <Popping
          open={true}
          handleOpen={handleSelectEvent}
          handleClose={handleModalClose}
          // renderStatus={renderStatus}
          // rerender={rerender}
          event={selectedEvent}
        />
      )}
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
