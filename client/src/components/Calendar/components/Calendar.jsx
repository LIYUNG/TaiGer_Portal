import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { FiExternalLink } from 'react-icons/fi';
import moment from 'moment';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { Scheduler } from '@aldabil/react-scheduler';
// import { de } from 'date-fns/esm/locale';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popping from './Popping';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  NoonNightLabel,
  getLocalTime,
  // getTimezoneOffset,
  getUTCTimezoneOffset,
  getUTCWithDST,
  // shiftDateByOffset,
  stringToColor,
  time_slots
} from '../../../Demo/Utils/contants';
import {
  is_TaiGer_Agent,
  is_TaiGer_Student
} from '../../../Demo/Utils/checking-functions';
import DEMO from '../../../store/constant';
import { useAuth } from '../../AuthProvider';
import ModalNew from '../../Modal';

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();
  const newEventTitle = '';
  const [newEventDescription, setNewEventDescription] = useState('');
  let available_termins = [];
  function getAvailableTermins({
    selected_day,
    selected_month,
    selected_year
  }) {
    return time_slots.flatMap((time_slot, j) => {
      const year = selected_year;
      const month = selected_month;
      const day = selected_day;

      const test_date = getUTCWithDST(
        year,
        month,
        day,
        user.timezone,
        time_slot.value
      );
      const start_date = new Date(test_date);
      const end_date = new Date(start_date);
      end_date.setMinutes(end_date.getMinutes() + 30);
      return {
        id: j * 10,
        title: `${start_date.getHours()}:${time_slot.value.split(':')[1]}`,
        start: start_date,
        end: end_date
        // provider: agent
      };
    });
  }
  if (is_TaiGer_Agent(user) && props.selected_year) {
    available_termins = getAvailableTermins({
      selected_day: props.selected_day,
      selected_month: props.selected_month,
      selected_year: props.selected_year
    });
  }

  const handleCreateEvent = () => {
    // Create a new event object and add it to the events array
    const end_date = new Date(props.newEventStart);
    end_date.setMinutes(end_date.getMinutes() + 30);
    const newEvent = {
      id: props.events?.length + 1,
      title: newEventTitle,
      start: props.newEventStart,
      end: end_date,
      description: newEventDescription
    };
    // const updatedEvents = [...props.events, newEvent];
    // setEvents(updatedEvents);
    props.handleModalCreateEvent(newEvent);
  };

  const eventPropGetter = (event) => {
    // Default background color for other events
    // console.log(theme);
    return {
      style: {
        color: theme.palette.text.primary,
        backgroundColor: stringToColor(
          `${event.provider.firstname} ${event.provider.lastname}`
        ) // Set a fallback background color for other events
      }
    };
  };
  // const FieldBooked = ({ start, end, title, description, requester_id }) => (
  //   <div className="flex flex-col items-center justify-center w-full h-full gap-1 my-auto">
  //     <div className="flex items-center gap-1">
  //       <span>
  //         {start?.toLocaleTimeString('en-US', {
  //           timeStyle: 'short'
  //         })}
  //       </span>
  //       -
  //       <span>
  //         {end?.toLocaleTimeString('en-US', {
  //           timeStyle: 'short'
  //         })}
  //       </span>
  //     </div>
  //     <div>{title}</div>
  //     <div>{description}</div>
  //     <div>{(requester_id ?? [])[0]?.firstname}</div>
  //   </div>
  // );
  // console.log(available_termins);
  return (
    <>
      {/* <Scheduler
        // locale={de}
        view="month"
        events={props.events.map((event) => {
          event.event_id = event._id;
          return event;
        })}
        eventRenderer={(event) => <FieldBooked {...event} />}
        onConfirm={(e) => {
          console.log(e);
          console.log('Confirm');
        }}
        day={{
          startHour: 0,
          endHour: 24,
          step: 60,
          navigation: true
        }}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 0,
          startHour: 8,
          endHour: 24,
          step: 60,
          navigation: true
        }}
        customEditor={(scheduler) => (
          <>
            {console.log(scheduler)}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Create New Event
            </Typography>
            <Box>
              <TextField
                fullWidth
                multiline
                minRows={6}
                onChange={(e) => setNewEventDescription(e.target.value)}
                value={scheduler.state.description.value}
                placeholder="Description"
              />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Time zone: {user.timezone}
              </Typography>
              <span>
                If the time zone not matches, please go to{' '}
                <Link to={`${DEMO.PROFILE}`} component={LinkDom}>
                  Profile <FiExternalLink />
                </Link>{' '}
                to update your time zone
              </span>
              <br />
              <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel id="time_slot">{t('Time Slot')}</InputLabel>
                <Select
                  labelId="Time_Slot"
                  name="Time_Slot"
                  id="Time_Slot"
                  value={new Date(scheduler.state.start.value) || ''}
                  label={'Time Slot'}
                  onChange={props.handleUpdateTimeSlot}
                >
                  <MenuItem value="">Please Select</MenuItem>
                  {getAvailableTermins({
                    selected_day: new Date(
                      scheduler.state.start.value
                    ).getDate(),
                    selected_month:
                      new Date(scheduler.state.start.value).getMonth() + 1,
                    selected_year: new Date(
                      scheduler.state.start.value
                    ).getFullYear()
                  })
                    // ?.sort((a, b) => (a.start < b.start ? -1 : 1))
                    .map((time_slot) => (
                      <MenuItem
                        value={`${time_slot.start}`}
                        key={`${time_slot.start}`}
                      >
                        {getLocalTime(time_slot.start, user.timezone)} UTC +
                        {getUTCTimezoneOffset(time_slot.start, user.timezone) /
                          60}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <br />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="Choose_Student">
                  {t('Choose Student')}
                </InputLabel>
                <Select
                  labelId="Choose_Student"
                  name="Choose_Student"
                  id="Choose_Student"
                  value={props.student_id}
                  label={'Choose Student'}
                  onChange={props.handleSelectStudent}
                >
                  <MenuItem value="" key="x">
                    Please Select
                  </MenuItem>
                  {props.students.map((student) => (
                    <MenuItem
                      value={`${student._id.toString()}`}
                      key={`${student._id.toString()}`}
                    >
                      {student.firstname} {student.lastname}/{' '}
                      {student.firstname_chinese} {student.lastname_chinese}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Button
                color="primary"
                variant="contained"
                disabled={
                  props.BookButtonDisable ||
                  newEventDescription?.length === 0 ||
                  props.student_id === ''
                }
                onClick={handleCreateEvent}
                sx={{ mr: 2 }}
              >
                {props.BookButtonDisable ? <CircularProgress /> : t('Create')}
              </Button>
              <Button variant="outlined" onClick={scheduler.close}>
                {t('Cancel')}
              </Button>
            </Box>
          </>
        )}
        fields={[
          {
            name: 'description',
            type: 'input',
            config: {
              label: 'Description',
              required: true,
              multiline: true,
              rows: 4,
              min: 1,
              variant: 'outlined'
            }
          },
          {
            name: 'title',
            type: 'input',
            config: {
              label: 'Title',
              required: true,
              multiline: true,
              rows: 1,
              min: 1,
              variant: 'outlined'
            }
          }
        ]}
        onDelete={(id) => {
          console.log(id);
          console.log('delete');
        }}
        viewerExtraComponent={(fields, event) => {
          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mt-2">
                <div className="text-lg">
                  Studnet:{event.requester_id[0].firstname}{' '}
                  {event.requester_id[0].lastname}
                </div>
                <div className="text-lg">
                  Agents:{event.receiver_id[0].firstname}{' '}
                  {event.receiver_id[0].lastname}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="text-lg">Description:</div>
                <div className="text-lg font-bold">{event.description}</div>
              </div>
            </div>
          );
        }}
      /> */}
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
          event: ({ event }) =>
            is_TaiGer_Student(user) ? (
              <span>
                {event.start.toLocaleTimeString()} {NoonNightLabel(event.start)}{' '}
              </span>
            ) : (
              <span>
                {event.start.toLocaleTimeString()} {NoonNightLabel(event.start)}
                {event.title} - {event.description}
              </span>
            )
        }}
        // Set the timeslots and step using the custom function
        timeslots={2}
        selectable={true}
        // Handle event click to show the modal
        onSelectEvent={props.handleSelectEvent}
        onSelectSlot={is_TaiGer_Agent(user) ? props.handleSelectSlot : () => {}}
        // Using the eventPropGetter to customize event rendering
        eventPropGetter={eventPropGetter} // Apply custom styles to events based on the logic
        // onSelectSlot={() => console.log('Triggered!')}
      />
      {/* Modal */}
      {/* {is_TaiGer_Student(user) && ( */}
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
        user={user}
      />
      {/* Modal for creating a new event */}
      {is_TaiGer_Agent(user) && (
        <ModalNew
          open={props.isNewEventModalOpen}
          onClose={props.handleNewEventModalClose}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Create New Event
          </Typography>
          <Box>
            <TextField
              fullWidth
              multiline
              minRows={6}
              onChange={(e) => setNewEventDescription(e.target.value)}
              value={newEventDescription}
              placeholder="Description"
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Time zone: {user.timezone}
            </Typography>
            <span>
              If the time zone not matches, please go to{' '}
              <Link to={`${DEMO.PROFILE}`} component={LinkDom}>
                Profile <FiExternalLink />
              </Link>{' '}
              to update your time zone
            </span>
            <br />
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="time_slot">{t('Time Slot')}</InputLabel>
              <Select
                labelId="Time_Slot"
                name="Time_Slot"
                id="Time_Slot"
                value={props.newEventStart}
                label={'Time Slot'}
                onChange={props.handleUpdateTimeSlot}
              >
                {available_termins
                  ?.sort((a, b) => (a.start < b.start ? -1 : 1))
                  .map((time_slot) => (
                    <MenuItem
                      value={`${time_slot.start}`}
                      key={`${time_slot.start}`}
                    >
                      {getLocalTime(time_slot.start, user.timezone)} UTC +
                      {getUTCTimezoneOffset(time_slot.start, user.timezone) /
                        60}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <br />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="Choose_Student">{t('Choose Student')}</InputLabel>
              <Select
                labelId="Choose_Student"
                name="Choose_Student"
                id="Choose_Student"
                value={props.student_id}
                label={'Choose Student'}
                onChange={props.handleSelectStudent}
              >
                <MenuItem value="" key="x">
                  Please Select
                </MenuItem>
                {props.students.map((student) => (
                  <MenuItem
                    value={`${student._id.toString()}`}
                    key={`${student._id.toString()}`}
                  >
                    {student.firstname} {student.lastname}/{' '}
                    {student.firstname_chinese} {student.lastname_chinese}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Button
              color="primary"
              variant="contained"
              disabled={
                props.BookButtonDisable ||
                newEventDescription?.length === 0 ||
                props.student_id === ''
              }
              onClick={handleCreateEvent}
              sx={{ mr: 2 }}
            >
              {props.BookButtonDisable ? <CircularProgress /> : t('Create')}
            </Button>
            <Button variant="outlined" onClick={props.handleNewEventModalClose}>
              {t('Cancel')}
            </Button>
          </Box>
        </ModalNew>
      )}
    </>
  );
};

export default MyCalendar;
