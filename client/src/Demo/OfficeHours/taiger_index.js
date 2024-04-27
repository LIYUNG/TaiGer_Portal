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
  MenuItem
} from '@mui/material';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Navigate, useParams, Link as LinkDom } from 'react-router-dom';
import moment from 'moment-timezone';

import {
  getNextDayDate,
  getTodayAsWeekday,
  getReorderWeekday,
  // getTimezoneOffset,
  isInTheFuture,
  getUTCWithDST
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { useTranslation } from 'react-i18next';

import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import { is_TaiGer_Agent } from '../Utils/checking-functions';
import EventConfirmationCard from '../../components/Calendar/components/EventConfirmationCard';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
import { appConfig } from '../../config';
import { a11yProps, CustomTabPanel } from '../../components/Tabs';
import { CreateNewEventModal } from '../../components/Calendar/components/CreateNewEventModal';
import useCalendarEvents from '../../hooks/useCalendarEvents';

function TaiGerOfficeHours() {
  const { user } = useAuth();
  const { user_id } = useParams();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const {
    events,
    agents,
    hasEvents,
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
    switchCalendarAndMyBookedEvents,
    handleModalCreateEvent,
    handleSelectStudent,
    res_modal_message,
    res_modal_status,
    ConfirmError
  } = useCalendarEvents({ user_id });

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

        <Typography color="text.primary">My Events</Typography>
      </Breadcrumbs>

      {hasEvents ? (
        <>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={switchCalendarAndMyBookedEvents}
          >
            {t('To Calendar', { ns: 'common' })}
          </Button>
          {events?.filter(
            (event) =>
              isInTheFuture(event.end) &&
              (!event.isConfirmedReceiver || !event.isConfirmedRequester)
          ).length !== 0 &&
            events
              ?.filter(
                (event) =>
                  isInTheFuture(event.end) &&
                  (!event.isConfirmedReceiver || !event.isConfirmedRequester)
              )
              .map((event, i) => (
                <EventConfirmationCard
                  key={i}
                  user={user}
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
          <Card>
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
                ? events
                    ?.filter(
                      (event) =>
                        isInTheFuture(event.end) &&
                        event.isConfirmedRequester &&
                        event.isConfirmedReceiver
                    )
                    .map((event, i) => (
                      <EventConfirmationCard
                        key={i}
                        user={user}
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
          <Card>
            <Typography variant="h6">{t('Past', { ns: 'common' })}</Typography>
            <Box>
              {events
                ?.filter((event) => !isInTheFuture(event.end))
                .map((event, i) => (
                  <EventConfirmationCard
                    key={i}
                    user={user}
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
          <ModalNew
            open={isConfirmModalOpen}
            onClose={handleConfirmAppointmentModalClose}
            centered
          >
            <Typography variant="body1">
              You are aware of this meeting time and confirm.
            </Typography>

            <Button
              color="secondary"
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
            >
              {BookButtonDisable ? (
                <CircularProgress size={16} />
              ) : (
                <>
                  <AiFillCheckCircle color="limegreen" size={16} />{' '}
                  {t('Yes', { ns: 'common' })}
                </>
              )}
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              size="small"
              onClick={handleConfirmAppointmentModalClose}
            >
              {t('Close', { ns: 'common' })}
            </Button>
          </ModalNew>
          <ModalNew
            open={isDeleteModalOpen}
            onClose={handleDeleteAppointmentModalClose}
            centered
            size="lg"
          >
            <Typography>{t('Do you want to cancel this meeting?')}</Typography>
            <br />
            <Button
              color="secondary"
              variant="contained"
              size="small"
              disabled={event_id === '' || BookButtonDisable}
              onClick={(e) => handleDeleteAppointmentModal(e, event_id)}
            >
              {BookButtonDisable ? (
                <CircularProgress size={16} />
              ) : (
                t('Delete', { ns: 'common' })
              )}
            </Button>
          </ModalNew>
        </>
      ) : (
        <>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={switchCalendarAndMyBookedEvents}
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
                user={user}
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
      <ModalNew
        open={isEditModalOpen}
        onClose={handleEditAppointmentModalClose}
        size="lg"
      >
        <Typography variant="h6">{t('Edit', { ns: 'common' })}</Typography>
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
          bg={`${event_temp.description?.length > 2000 ? 'danger' : 'primary'}`}
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
      </ModalNew>
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
