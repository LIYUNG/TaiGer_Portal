import React, { useState } from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import { Link as LinkDom } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import i18next from 'i18next';

import DEMO from '../../../store/constant';
import { useAuth } from '../../AuthProvider';
import { getLocalTime, getUTCTimezoneOffset } from '../../../utils/contants';

export function CreateNewEventModal(props) {
  const [newEventDescription, setNewEventDescription] = useState('');
  const { user } = useAuth();
  const { available_termins } = props;
  const newEventTitle = '';
  const getDate = (time) => {
    const datePart = time.split('T')[0]; // "2024-11-14"

    return datePart;
  };
  const getHour = (time) => {
    const timePart = time.split('T')[1].split('+')[0]; // "00:00:00"

    const hours = timePart.split(':')[0];
    return hours;
  };
  const getMinute = (time) => {
    const timePart = time.split('T')[1].split('+')[0]; // "00:00:00"

    const minutes = timePart.split(':')[1];
    return minutes;
  };
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
    props.handleModalCreateEvent(newEvent);
  };

  return (
    <Dialog
      open={props.isNewEventModalOpen}
      onClose={props.handleNewEventModalClose}
    >
      <DialogTitle>Create New Event</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={6}
          onChange={(e) => setNewEventDescription(e.target.value)}
          value={newEventDescription}
          placeholder="Description"
        />

        <span>
          If the time zone not matches, please go to{' '}
          <Link to={`${DEMO.PROFILE}`} component={LinkDom}>
            Profile <LaunchIcon fontSize="small" />
          </Link>{' '}
          to update your time zone
        </span>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Time zone: {user.timezone}
          {available_termins[0] &&
            ` ( UTC +${
              getUTCTimezoneOffset(available_termins[0].start, user.timezone) /
              60
            } ) `}
        </Typography>
        <Typography variant="body1">
          Date:{' '}
          {available_termins[0] &&
            getDate(getLocalTime(available_termins[0]?.start, user.timezone))}
        </Typography>
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="time_slot">
            {i18next.t('Time Slot', { ns: 'common' })}
          </InputLabel>
          <Select
            labelId="Time_Slot"
            name="Time_Slot"
            id="Time_Slot"
            value={props.newEventStart}
            label={i18next.t('Time Slot', { ns: 'common' })}
            onChange={props.handleUpdateTimeSlot}
          >
            {available_termins
              ?.sort((a, b) => (a.start < b.start ? -1 : 1))
              .map((time_slot) => (
                <MenuItem
                  value={`${time_slot.start}`}
                  key={`${time_slot.start}`}
                >
                  {`${getHour(
                    getLocalTime(time_slot.start, user.timezone)
                  )}:${getMinute(
                    getLocalTime(time_slot.start, user.timezone)
                  )}`}
                  {/* {getLocalTime(time_slot.start, user.timezone)} */}
                  {/* {`UTC + ${
                    getUTCTimezoneOffset(time_slot.start, user.timezone) / 60
                  } `} */}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="Choose_Student">
            {i18next.t('Choose Student')}
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
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disabled={
            props.BookButtonDisable ||
            newEventDescription?.length === 0 ||
            props.student_id === ''
          }
          onClick={handleCreateEvent}
        >
          {props.BookButtonDisable ? <CircularProgress /> : i18next.t('Create')}
        </Button>
        <Button variant="outlined" onClick={props.handleNewEventModalClose}>
          {i18next.t('Cancel', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
