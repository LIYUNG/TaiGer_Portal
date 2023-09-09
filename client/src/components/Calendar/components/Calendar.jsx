import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popping from './Popping';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import {
  convertDate,
  getTimezoneOffset,
  shiftDateByOffset,
  stringToColor,
  time_slots
} from '../../../Demo/Utils/contants';
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
  let available_termins;
  if (is_TaiGer_Agent(props.user)) {
    available_termins = time_slots.flatMap((time_slot, j) => {
      const Some_Date = new Date(props.newEventStart);
      const year = Some_Date.getFullYear();
      const month = Some_Date.getMonth() + 1;
      const day = Some_Date.getDate();
      console.log(year);
      console.log(month);
      console.log(day);
      const hour = parseInt(time_slot.value.split(':')[0], 10);
      const minutes = parseInt(time_slot.value.split(':')[1], 10);
      const time_difference =
        getTimezoneOffset(Intl.DateTimeFormat().resolvedOptions().timeZone) -
        getTimezoneOffset(props.user.timezone);

      return {
        id: j * 10,
        title: `${(hour + time_difference) % 24}:${
          time_slot.value.split(':')[1]
        }`,
        start: shiftDateByOffset(
          new Date(year, month - 1, day, hour, minutes),
          0
        ),
        end: shiftDateByOffset(
          new Date(year, month - 1, day, hour, minutes),
          0.5
        )
        // provider: agent
      };
    });
  }

  const handleCreateEvent = () => {
    // Create a new event object and add it to the events array
    const newEvent = {
      id: props.events?.length + 1,
      title: newEventTitle,
      start: props.newEventStart,
      // end: selectedEvent.end,
      description: newEventDescription
    };
    const updatedEvents = [...props.events, newEvent];
    // setEvents(updatedEvents);
    props.handleModalCreateEvent(newEvent);
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
        // Using the eventPropGetter to customize event rendering
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
      {is_TaiGer_Agent(props.user) && (
        <Modal
          show={props.isNewEventModalOpen}
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
            <h6>
              Time zone: {props.user.timezone} UTC
              {getTimezoneOffset(props.user.timezone) >= 0
                ? `+${getTimezoneOffset(props.user.timezone)}`
                : getTimezoneOffset(props.user.timezone)}
            </h6>
            <Form>
              <Form.Label>Time Slot</Form.Label>
              <Form.Control
                as="select"
                onChange={props.handleUpdateTimeSlot}
                value={props.newEventStart}
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
            <Form>
              <Form.Label>Time Slot</Form.Label>
              <Form.Control
                as="select"
                onChange={props.handleSelectStudent}
                value={props.student_id}
              >
                {props.students.map((student, j) => (
                  <option
                    value={`${student._id.toString()}`}
                    key={`${student._id.toString()}`}
                  >
                    {student.firstname} {student.lastname}/{' '}
                    {student.firstname_chinese} {student.lastname_chinese}
                  </option>
                ))}
              </Form.Control>
            </Form>
            {/* {convertDate(props.newEventStart)}
          {convertDate(props.newEventEnd)} */}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              disabled={props.BookButtonDisable}
              onClick={handleCreateEvent}
            >
              {props.BookButtonDisable ? (
                <Spinner
                  animation="border"
                  role="status"
                  variant="light"
                  size="sm"
                >
                  <span className="visually-hidden"></span>
                </Spinner>
              ) : (
                'Create'
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={props.handleNewEventModalClose}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default MyCalendar;
