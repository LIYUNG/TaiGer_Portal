import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
// import { Scheduler } from '@aldabil/react-scheduler';
// import { de } from 'date-fns/esm/locale';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import Popping from './Popping';
import { useTheme } from '@mui/material';
import { NoonNightLabel, stringToColor } from '../../../utils/contants';
import { is_TaiGer_Agent, is_TaiGer_Student } from '@taiger-common/core';
import { useAuth } from '../../AuthProvider';

const localizer = momentLocalizer(moment);

const MyCalendar = ({
    BookButtonDisable,
    events,
    selectedEvent,
    handleModalClose,
    handleModalBook,
    handleChange,
    handleSelectEvent,
    handleSelectSlot,
    handleChangeReceiver,
    newDescription,
    newReceiver
}) => {
    const { user } = useAuth();
    const theme = useTheme();

    const eventPropGetter = (event) => {
        // Default background color for other events
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
                  Profile  
                </Link>{' '}
                to update your time zone
              </span>
              <br />
              <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel id="time_slot">{t('Time Slot', { ns: 'common' })}</InputLabel>
                <Select
                  labelId="Time_Slot"
                  name="Time_Slot"
                  id="Time_Slot"
                  value={new Date(scheduler.state.start.value) || ''}
                  label={t('Time Slot', { ns: 'common' })}
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
                {t('Cancel', { ns: 'common' })}
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
                components={{
                    event: ({ event }) =>
                        is_TaiGer_Student(user) ? (
                            <span>
                                {event.start.toLocaleTimeString()}{' '}
                                {NoonNightLabel(event.start)}{' '}
                            </span>
                        ) : (
                            <span>
                                {event.start.toLocaleTimeString()}{' '}
                                {NoonNightLabel(event.start)}
                                {event.title} - {event.description}
                            </span>
                        )
                }}
                defaultView="month" // Set the default view to "month"
                endAccessor="end"
                eventPropGetter={eventPropGetter} // Apply custom styles to events based on the logic
                events={events}
                localizer={localizer}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={
                    is_TaiGer_Agent(user) ? handleSelectSlot : () => {}
                }
                popup
                selectable={true}
                startAccessor="start"
                style={{ height: 600 }}
                // Using the popup to show event details
                // Rendering additional event information in the popup

                // Set the timeslots and step using the custom function
                timeslots={2}
                views={['month', 'week', 'day']}
                // Handle event click to show the modal

                // Using the eventPropGetter to customize event rendering
                // onSelectSlot={() => console.log('Triggered!')}
            />

            <Popping
                BookButtonDisable={BookButtonDisable}
                event={selectedEvent}
                handleBook={handleModalBook}
                handleChange={handleChange}
                handleChangeReceiver={handleChangeReceiver}
                handleClose={handleModalClose}
                newDescription={newDescription}
                newReceiver={newReceiver}
                open={selectedEvent}
                user={user}
            />
        </>
    );
};

export default MyCalendar;
