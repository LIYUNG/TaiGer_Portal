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

export const CreateNewEventModal = (props) => {
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
            onClose={props.handleNewEventModalClose}
            open={props.isNewEventModalOpen}
        >
            <DialogTitle>Create New Event</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    minRows={6}
                    multiline
                    onChange={(e) => setNewEventDescription(e.target.value)}
                    placeholder="Description"
                    value={newEventDescription}
                />

                <span>
                    If the time zone not matches, please go to{' '}
                    <Link component={LinkDom} to={`${DEMO.PROFILE}`}>
                        Profile <LaunchIcon fontSize="small" />
                    </Link>{' '}
                    to update your time zone
                </span>
                <Typography sx={{ mt: 2 }} variant="body1">
                    Time zone: {user.timezone}
                    {available_termins[0]
                        ? ` ( UTC +${
                              getUTCTimezoneOffset(
                                  available_termins[0].start,
                                  user.timezone
                              ) / 60
                          } ) `
                        : null}
                </Typography>
                <Typography variant="body1">
                    Date:{' '}
                    {available_termins[0]
                        ? getDate(
                              getLocalTime(
                                  available_termins[0]?.start,
                                  user.timezone
                              )
                          )
                        : null}
                </Typography>
                <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel id="time_slot">
                        {i18next.t('Time Slot', { ns: 'common' })}
                    </InputLabel>
                    <Select
                        id="Time_Slot"
                        label={i18next.t('Time Slot', { ns: 'common' })}
                        labelId="Time_Slot"
                        name="Time_Slot"
                        onChange={props.handleUpdateTimeSlot}
                        value={props.newEventStart}
                    >
                        {available_termins
                            ?.sort((a, b) => (a.start < b.start ? -1 : 1))
                            .map((time_slot) => (
                                <MenuItem
                                    key={`${time_slot.start}`}
                                    value={`${time_slot.start}`}
                                >
                                    {`${getHour(
                                        getLocalTime(
                                            time_slot.start,
                                            user.timezone
                                        )
                                    )}:${getMinute(
                                        getLocalTime(
                                            time_slot.start,
                                            user.timezone
                                        )
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
                        id="Choose_Student"
                        label="Choose Student"
                        labelId="Choose_Student"
                        name="Choose_Student"
                        onChange={props.handleSelectStudent}
                        value={props.student_id}
                    >
                        <MenuItem key="x" value="">
                            Please Select
                        </MenuItem>
                        {props.students.map((student) => (
                            <MenuItem
                                key={`${student._id.toString()}`}
                                value={`${student._id.toString()}`}
                            >
                                {student.firstname} {student.lastname}/{' '}
                                {student.firstname_chinese}{' '}
                                {student.lastname_chinese}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disabled={
                        props.BookButtonDisable ||
                        newEventDescription?.length === 0 ||
                        props.student_id === ''
                    }
                    onClick={handleCreateEvent}
                    variant="contained"
                >
                    {props.BookButtonDisable ? (
                        <CircularProgress />
                    ) : (
                        i18next.t('Create')
                    )}
                </Button>
                <Button
                    onClick={props.handleNewEventModalClose}
                    variant="outlined"
                >
                    {i18next.t('Cancel', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
