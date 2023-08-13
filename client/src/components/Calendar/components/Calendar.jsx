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

const MyCalendar = (props) => {
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

  const disabledTimeslots = [
    // An array of objects representing the start and end times of disabled slots
    {
      start: new Date(2023, 6, 24, 13, 0),
      end: new Date(2023, 6, 24, 14, 0)
    },
    { start: new Date(2023, 6, 25, 9, 0), end: new Date(2023, 6, 25, 11, 0) }
    // Add more disabled timeslots as needed
  ];

  const eventPropGetter = (event, start, end, isSelected) => {
    // Check any property of the event to determine the background color
    if (event.title === 'Meeting 1') {
      return {
        style: {
          backgroundColor: 'green' // Set the background color for this event
        }
      };
    } else if (event.title === 'Meeting 2') {
      return {
        style: {
          backgroundColor: 'blue' // Set a different background color for this event
        }
      };
    }

    // Default background color for other events
    return {
      style: {
        backgroundColor: 'red' // Set a fallback background color for other events
      }
    };
  };

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

  // Office hours configuration (change as per your requirement)
  const officeHours = {
    start: 8, // Office start time (in hours, 24-hour format)
    end: 18, // Office end time (in hours, 24-hour format)
    step: 30 // Slot granularity in minutes (e.g., 30 minutes)
  };

  // Custom function to determine active and disabled timeslots
  const getTimeslots = () => {
    const timeslots = [];
    const { start, end, step } = officeHours;

    if (step <= 0) {
      throw new Error('Step must be greater than zero.');
    }

    if (start >= end) {
      throw new Error('Office start time must be before the end time.');
    }

    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += step) {
        const slotDate = moment()
          .hour(hour)
          .minute(minute)
          .seconds(0)
          .milliseconds(0)
          .toDate();

        timeslots.push(slotDate);
      }
    }

    return timeslots;
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
        slotPropGetter={slotPropGetter} // Apply custom styles to slots based on the logic
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
        step={officeHours.step}
        selectable={true}
        // Handle event click to show the modal
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventPropGetter} // Apply custom styles to events based on the logic
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
