import React, { useState } from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Typography
} from '@mui/material';

import {
  getLocalTime,
  getUTCTimezoneOffset
} from '../../../Demo/Utils/contants';
import ModalNew from '../../Modal';
import DEMO from '../../../store/constant';
import { useAuth } from '../../AuthProvider';

export function CreateNewEventModal(props) {
  const { t } = useTranslation();
  const [newEventDescription, setNewEventDescription] = useState('');
  const { user } = useAuth();
  const { available_termins } = props;
  const newEventTitle = '';

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
            Profile <LaunchIcon fontSize="small" />
          </Link>{' '}
          to update your time zone
        </span>
        <br />
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="time_slot">
            {t('Time Slot', { ns: 'common' })}
          </InputLabel>
          <Select
            labelId="Time_Slot"
            name="Time_Slot"
            id="Time_Slot"
            value={props.newEventStart}
            label={t('Time Slot', { ns: 'common' })}
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
                  {getUTCTimezoneOffset(time_slot.start, user.timezone) / 60}
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
          {t('Cancel', { ns: 'common' })}
        </Button>
      </Box>
    </ModalNew>
  );
}
