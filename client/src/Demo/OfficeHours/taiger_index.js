import React, { useState } from 'react';
import {
  Box,
  Badge,
  Button,
  Card,
  CircularProgress,
  Typography,
  TextField,
  Link,
  Breadcrumbs,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonGroup
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {
  Navigate,
  useParams,
  Link as LinkDom,
  useSearchParams
} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { is_TaiGer_Agent } from '@taiger-common/core';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import {
  getNextDayDate,
  getTodayAsWeekday,
  getReorderWeekday,
  isInTheFuture,
  getUTCWithDST
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import EventConfirmationCard from '../../components/Calendar/components/EventConfirmationCard';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import { a11yProps, CustomTabPanel } from '../../components/Tabs';
import { CreateNewEventModal } from '../../components/Calendar/components/CreateNewEventModal';
import useCalendarEvents from '../../hooks/useCalendarEvents';

const DateRangePickerBasic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startTime, setStartTime] = useState(
    searchParams.get('startTime')
      ? dayjs(searchParams.get('startTime'))
      : undefined
  );

  const [endTime, setEndTime] = useState(
    searchParams.get('endTime') ? dayjs(searchParams.get('endTime')) : undefined
  );

  const { t } = useTranslation();

  const handleShortcut = (type) => {
    let newStartDate, newEndDate;

    if (type === 'week') {
      newStartDate = dayjs().subtract(1, 'week').startOf('day');
      newEndDate = dayjs().endOf('day');
    } else if (type === 'month') {
      newStartDate = dayjs().subtract(1, 'month').startOf('day');
      newEndDate = dayjs().endOf('day');
    } else if (type === 'year') {
      newStartDate = dayjs().subtract(12, 'month').startOf('day');
      newEndDate = dayjs().endOf('day');
    }

    setStartTime(newStartDate);
    setEndTime(newEndDate);
  };

  const handleSubmit = () => {
    if (startTime && endTime) {
      const newParams = {};
      if (startTime)
        newParams.startTime = startTime
          .startOf('minute') // Round to the start of the minute
          .toDate()
          .toISOString();
      if (endTime)
        newParams.endTime = endTime
          .startOf('minute') // Round to the start of the minute
          .toDate()
          .toISOString();

      setSearchParams(newParams); // Update the URL query parameters
    } else {
      alert('Please select both start and end date-times.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          justifyContent: 'space-between',
          marginTop: 2
        }}
      >
        <Button variant="outlined" onClick={() => handleShortcut('week')}>
          Last 1 Week
        </Button>
        <Button variant="outlined" onClick={() => handleShortcut('month')}>
          Last 1 Month
        </Button>{' '}
        <Button variant="outlined" onClick={() => handleShortcut('year')}>
          Last 1 Year
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row', // Layout in a single row
          alignItems: 'center', // Align items vertically
          gap: 2, // Add spacing between items
          width: '100%'
        }}
      >
        <DateTimePicker
          label="Start Date-Time"
          value={startTime}
          onChange={(newValue) => setStartTime(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
        <DateTimePicker
          label="End Date-Time"
          value={endTime}
          minDateTime={startTime} // Ensure end date-time is after start date-time
          onChange={(newValue) => setEndTime(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!startTime || !endTime}
        >
          {t('Submit', { ns: 'common' })}
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

function TaiGerOfficeHours() {
  const { user } = useAuth();
  const { user_id } = useParams();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const startTime = searchParams.get('startTime') || '';

  const endTime = searchParams.get('endTime') || '';
  const [viewMode, setViewMode] = useState(
    startTime && endTime ? 'past' : 'future'
  );

  const [value, setValue] = useState(0);
  const {
    events,
    agents,
    booked_events,
    res_status,
    isLoaded,
    isConfirmModalOpen,
    event_id,
    event_temp,
    BookButtonDisable,
    isEditModalOpen,
    newReceiver,
    newDescription,
    selectedEvent,
    newEventStart,
    newEventEnd,
    isNewEventModalOpen,
    isDeleteModalOpen,
    available_termins_full,
    student_id,
    students,
    handleConfirmAppointmentModalOpen,
    handleEditAppointmentModalOpen,
    handleModalBook,
    handleUpdateDescription,
    handleEditAppointmentModal,
    handleConfirmAppointmentModal,
    handleDeleteAppointmentModal,
    handleUpdateTimeSlot,
    handleUpdateTimeSlotAgent,
    handleConfirmAppointmentModalClose,
    handleEditAppointmentModalClose,
    handleDeleteAppointmentModalClose,
    handleDeleteAppointmentModalOpen,
    handleModalClose,
    handleChangeReceiver,
    handleSelectEvent,
    handleChange,
    handleSelectSlotAgent,
    handleNewEventModalClose,
    handleModalCreateEvent,
    handleSelectStudent,
    res_modal_message,
    res_modal_status,
    ConfirmError
  } = useCalendarEvents({
    user_id,
    startTime: startTime || new Date().toISOString().slice(0, 16) + 'Z',
    endTime: endTime || ''
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  if (!is_TaiGer_Agent(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  if (!isLoaded || !students) {
    return <Loading />;
  }
  TabTitle(`Office Hours`);
  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  let available_termins = [];
  available_termins = [0, 1, 2, 3, 4, 5].flatMap((iter, x) =>
    agents.flatMap((agent) =>
      agent.timezone && moment.tz.zone(agent.timezone)
        ? getReorderWeekday(getTodayAsWeekday(agent.timezone)).flatMap(
            (weekday, i) => {
              const timeSlots =
                agent.officehours &&
                agent.officehours[weekday]?.active &&
                agent.officehours[weekday].time_slots.flatMap(
                  (time_slot, j) => {
                    const { year, month, day } = getNextDayDate(
                      getReorderWeekday(getTodayAsWeekday(agent.timezone)),
                      weekday,
                      agent.timezone,
                      iter
                    );
                    const test_date = getUTCWithDST(
                      year,
                      month,
                      day,
                      agent.timezone,
                      time_slot.value
                    );

                    const end_date = new Date(test_date);
                    end_date.setMinutes(end_date.getMinutes() + 30);
                    return {
                      id: j * 10 + i * 100 + x * 1000 + 1,
                      title: `${new Date(test_date)}`,
                      start: new Date(test_date),
                      end: end_date,
                      provider: agent
                    };
                  }
                );
              return timeSlots || [];
            }
          )
        : []
    )
  );

  return (
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>

        <Typography color="text.primary">
          {t('My Events', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>

      {!showCalendar ? (
        <>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {t('To Calendar', { ns: 'common' })}
          </Button>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            style={{ marginBottom: '20px' }}
          >
            <Button
              onClick={() => {
                setSearchParams({
                  startTime: new Date().toISOString().slice(0, 16) + 'Z'
                });
                setViewMode('future');
              }}
              variant={viewMode === 'future' ? 'contained' : 'outlined'}
            >
              {t('Upcoming', { ns: 'common' })}
            </Button>
            <Button
              onClick={() => {
                setSearchParams({
                  startTime: '',
                  endTime: ''
                });
                setViewMode('past');
              }}
              variant={viewMode === 'past' ? 'contained' : 'outlined'}
            >
              {t('Past', { ns: 'common' })}
            </Button>
          </ButtonGroup>

          {viewMode === 'future' && (
            <>
              {events?.filter(
                (event) =>
                  isInTheFuture(event.end) &&
                  (!event.isConfirmedReceiver || !event.isConfirmedRequester)
              ).length !== 0 &&
                _.reverse(
                  _.sortBy(
                    events?.filter(
                      (event) =>
                        isInTheFuture(event.end) &&
                        (!event.isConfirmedReceiver ||
                          !event.isConfirmedRequester)
                    ),
                    ['start']
                  )
                )?.map((event, i) => (
                  <EventConfirmationCard
                    key={i}
                    event={event}
                    handleConfirmAppointmentModalOpen={
                      handleConfirmAppointmentModalOpen
                    }
                    handleEditAppointmentModalOpen={
                      handleEditAppointmentModalOpen
                    }
                    handleDeleteAppointmentModalOpen={
                      handleDeleteAppointmentModalOpen
                    }
                  />
                ))}
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">
                  {t('Upcoming', { ns: 'common' })}
                </Typography>
                <Box>
                  {events?.filter(
                    (event) =>
                      isInTheFuture(event.end) &&
                      event.isConfirmedRequester &&
                      event.isConfirmedReceiver
                  ).length !== 0
                    ? _.reverse(
                        _.sortBy(
                          events?.filter(
                            (event) =>
                              isInTheFuture(event.end) &&
                              event.isConfirmedRequester &&
                              event.isConfirmedReceiver
                          ),
                          ['start']
                        )
                      ).map((event, i) => (
                        <EventConfirmationCard
                          key={i}
                          event={event}
                          handleConfirmAppointmentModalOpen={
                            handleConfirmAppointmentModalOpen
                          }
                          handleEditAppointmentModalOpen={
                            handleEditAppointmentModalOpen
                          }
                          handleDeleteAppointmentModalOpen={
                            handleDeleteAppointmentModalOpen
                          }
                        />
                      ))
                    : t('No upcoming event', { ns: 'common' })}
                </Box>
              </Card>
            </>
          )}

          {viewMode === 'past' &&
            (isLoaded ? (
              <Card sx={{ p: 2 }}>
                <DateRangePickerBasic />
                <Typography variant="h6" sx={{ p: 2 }}>
                  {t('Past', { ns: 'common' })}
                </Typography>
                <Box>
                  {_.reverse(_.sortBy(events, ['start'])).map((event, i) => (
                    <EventConfirmationCard
                      key={i}
                      event={event}
                      handleConfirmAppointmentModalOpen={
                        handleConfirmAppointmentModalOpen
                      }
                      handleEditAppointmentModalOpen={
                        handleEditAppointmentModalOpen
                      }
                      handleDeleteAppointmentModalOpen={
                        handleDeleteAppointmentModalOpen
                      }
                      disabled={true}
                    />
                  ))}
                </Box>
              </Card>
            ) : (
              <CircularProgress />
            ))}

          <Dialog
            open={isConfirmModalOpen}
            onClose={handleConfirmAppointmentModalClose}
            centered
          >
            <DialogTitle>{t('Confirm Meeting', { ns: 'common' })}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You are aware of this meeting time and confirm.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                fullWidth
                variant="contained"
                size="small"
                disabled={
                  event_id === '' ||
                  event_temp?.description?.length === 0 ||
                  BookButtonDisable
                }
                onClick={(e) =>
                  handleConfirmAppointmentModal(e, event_id, event_temp)
                }
                startIcon={
                  BookButtonDisable ? (
                    <CircularProgress size={24} />
                  ) : (
                    <CheckIcon />
                  )
                }
              >
                {t('Yes', { ns: 'common' })}
              </Button>
              <Button
                color="secondary"
                fullWidth
                variant="outlined"
                size="small"
                onClick={handleConfirmAppointmentModalClose}
              >
                {t('Close', { ns: 'common' })}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={isDeleteModalOpen}
            onClose={handleDeleteAppointmentModalClose}
          >
            <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t('Do you want to cancel this meeting?')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                disabled={event_id === '' || BookButtonDisable}
                onClick={(e) => handleDeleteAppointmentModal(e, event_id)}
                startIcon={
                  BookButtonDisable ? (
                    <CircularProgress size={16} />
                  ) : (
                    <DeleteIcon />
                  )
                }
              >
                {t('Delete', { ns: 'common' })}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {t('My Appointments')}
          </Button>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              {/* TODO: subpath tab for URL */}
              <Tabs
                value={value}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="primary"
                aria-label="basic tabs example"
              >
                <Tab label={t('Calendar')} {...a11yProps(0)} />
                <Tab label={t('Available Blocks')} {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <MyCalendar
                events={[...booked_events]}
                handleSelectEvent={handleSelectEvent}
                handleUpdateTimeSlot={handleUpdateTimeSlot}
                handleChange={handleChange}
                handleModalClose={handleModalClose}
                handleChangeReceiver={handleChangeReceiver}
                handleSelectSlot={handleSelectSlotAgent}
                handleSelectStudent={handleSelectStudent}
                handleNewEventModalClose={handleNewEventModalClose}
                handleModalBook={handleModalBook}
                handleModalCreateEvent={handleModalCreateEvent}
                newReceiver={newReceiver}
                newDescription={newDescription}
                selectedEvent={selectedEvent}
                newEventEnd={newEventEnd}
                isNewEventModalOpen={isNewEventModalOpen}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {booked_events
                .sort((a, b) => (a.start < b.start ? -1 : 1))
                .map((time_slot, j) => (
                  <Card key={j}>
                    <Typography>
                      {time_slot.start.toLocaleString()} to{' '}
                      {time_slot.end.toLocaleString()}
                    </Typography>
                  </Card>
                ))}
            </CustomTabPanel>
          </Card>
        </>
      )}
      <Dialog open={isEditModalOpen} onClose={handleEditAppointmentModalClose}>
        <DialogTitle>{t('Edit', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="textarea"
            maxLength={2000}
            label="請寫下想討論的主題"
            multiline
            rows="10"
            placeholder="Example：我想定案選校、選課，我想討論簽證，德語班。"
            value={event_temp.description || ''}
            isInvalid={event_temp.description?.length > 2000}
            onChange={(e) => handleUpdateDescription(e)}
          />
          <Badge
            bg={`${
              event_temp.description?.length > 2000 ? 'danger' : 'primary'
            }`}
          >
            {event_temp.description?.length || 0}/{2000}
          </Badge>
          <Typography variant="body1">Student: </Typography>
          {event_temp?.requester_id?.map((requester, idx) => (
            <Typography fontWeight="bold" key={idx}>
              {requester.firstname} {requester.lastname}
            </Typography>
          ))}
          <Typography>
            Time zone: {user.timezone}. (Please update it in{' '}
            <a href="/profile" target="_blank">
              Profile
            </a>
            )
          </Typography>
          <br />
          <FormControl fullWidth>
            <InputLabel id="time-slot">
              {t('Time Slot', { ns: 'common' })}
            </InputLabel>
            <Select
              labelId="study_group"
              label="Select target group"
              name="study_group"
              id="study_group"
              onChange={(e) => handleUpdateTimeSlot(e)}
              value={new Date(event_temp.start).toString()}
            >
              {available_termins
                .sort((a, b) => (a.start < b.start ? -1 : 1))
                .map((time_slot) => (
                  <MenuItem
                    value={`${time_slot.start}`}
                    key={`${time_slot.start}`}
                  >
                    {time_slot.start.toLocaleString()} to{' '}
                    {time_slot.end.toLocaleString()}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            disabled={
              event_id === '' ||
              event_temp?.description?.length === 0 ||
              BookButtonDisable
            }
            onClick={(e) => handleEditAppointmentModal(e, event_id, event_temp)}
          >
            {BookButtonDisable ? (
              <CircularProgress size={16} />
            ) : (
              t('Update', { ns: 'common' })
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {is_TaiGer_Agent(user) && (
        <CreateNewEventModal
          // {...props}
          events={events}
          newEventStart={newEventStart}
          handleModalCreateEvent={handleModalCreateEvent}
          isNewEventModalOpen={isNewEventModalOpen}
          handleNewEventModalClose={handleNewEventModalClose}
          handleUpdateTimeSlot={handleUpdateTimeSlotAgent}
          student_id={student_id}
          BookButtonDisable={BookButtonDisable}
          handleSelectStudent={handleSelectStudent}
          students={students}
          available_termins={available_termins_full}
        />
      )}
    </Box>
  );
}

export default TaiGerOfficeHours;
