import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
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
  Tab
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

import {
  confirmEvent,
  deleteEvent,
  getEvents,
  postEvent,
  updateEvent
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import {
  is_TaiGer_Agent,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import EventConfirmationCard from '../../components/Calendar/components/EventConfirmationCard';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
import { appConfig } from '../../config';
import { a11yProps, CustomTabPanel } from '../../components/Tabs';

function TaiGerOfficeHours() {
  const { user } = useAuth();
  const { user_id } = useParams();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [taiGerOfficeHoursState, setTaiGerOfficeHours] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    agents: {},
    hasEvents: false,
    students: null,
    student_id: '',
    updateconfirmed: false,
    updatecredentialconfirmed: false,
    isDeleteModalOpen: false,
    isEditModalOpen: false,
    isConfirmModalOpen: false,
    event_temp: {},
    event_id: '',
    BookButtonDisable: false,
    selectedEvent: {},
    newReceiver: '',
    newDescription: '',
    newEventTitle: '',
    newEventStart: null,
    newEventEnd: null,
    isNewEventModalOpen: false,
    selected_year: 0,
    selected_month: 0,
    selected_day: 0,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    getEvents().then(
      (resp) => {
        const { data, agents, hasEvents, students, success } = resp.data;
        const { status } = resp;
        if (success) {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            isLoaded: true,
            agents,
            hasEvents,
            events: data,
            students,
            success: success,
            res_status: status
          }));
        } else {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setTaiGerOfficeHours((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [user_id]);

  const handleConfirmAppointmentModal = (e, event_id, updated_event) => {
    e.preventDefault();
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    confirmEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        const temp_events = [...taiGerOfficeHoursState.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        if (success) {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            isLoaded: true,
            isConfirmModalOpen: false,
            events: temp_events,
            event_temp: {},
            event_id: '',
            BookButtonDisable: false,
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          }));
        } else {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            isLoaded: true,
            event_temp: {},
            event_id: '',
            BookButtonDisable: false,
            res_status: status
          }));
        }
      },
      (error) => {
        setTaiGerOfficeHours((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          BookButtonDisable: false,
          res_status: 500
        }));
      }
    );
  };

  const handleEditAppointmentModal = (e, event_id, updated_event) => {
    e.preventDefault();
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    updateEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        let temp_events = [...taiGerOfficeHoursState.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        if (success) {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            isLoaded: true,
            isEditModalOpen: false,
            events: temp_events,
            event_temp: {},
            event_id: '',
            BookButtonDisable: false,
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          }));
        } else {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            isLoaded: true,
            event_temp: {},
            BookButtonDisable: false,
            event_id: '',
            res_status: status
          }));
        }
      },
      (error) => {
        setTaiGerOfficeHours((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          BookButtonDisable: false,
          res_status: 500
        }));
      }
    );
  };

  const handleDeleteAppointmentModal = (e, event_id) => {
    e.preventDefault();
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    deleteEvent(event_id).then(
      (resp) => {
        const { data, agents, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            isLoaded: true,
            agents,
            hasEvents,
            events: data,
            event_id: '',
            BookButtonDisable: false,
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          }));
        } else {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            isLoaded: true,
            event_id: '',
            res_status: status
          }));
        }
      },
      (error) => {
        setTaiGerOfficeHours((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          BookButtonDisable: false,
          res_status: 500
        }));
      }
    );
  };

  const handleModalBook = (e) => {
    const eventWrapper = { ...taiGerOfficeHoursState.selectedEvent };
    if (is_TaiGer_Student(user)) {
      eventWrapper.requester_id = user._id.toString();
      eventWrapper.description = taiGerOfficeHoursState.newDescription;
      eventWrapper.receiver_id = taiGerOfficeHoursState.newReceiver;
    }
    e.preventDefault();
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    postEvent(eventWrapper).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        const events_temp = [...taiGerOfficeHoursState.events];
        events_temp.push(data);
        if (success) {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            selectedEvent: {},
            events: data,
            BookButtonDisable: false,
            hasEvents: true,
            isDeleteModalOpen: false,
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            selectedEvent: {},
            isDeleteModalOpen: false,
            BookButtonDisable: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setTaiGerOfficeHours((prevState) => ({
          ...prevState,
          error,
          isLoaded: true,
          newDescription: '',
          newReceiver: '',
          selectedEvent: {},
          isDeleteModalOpen: false,
          BookButtonDisable: false
        }));
      }
    );
  };

  // Only Agent can request
  const handleModalCreateEvent = (newEvent) => {
    const eventWrapper = { ...newEvent };
    if (is_TaiGer_Agent(user)) {
      const temp_std = taiGerOfficeHoursState.students.find(
        (std) => std._id.toString() === taiGerOfficeHoursState.student_id
      );
      eventWrapper.title = `${temp_std.firstname} ${temp_std.lastname} ${temp_std.firstname_chinese} ${temp_std.lastname_chinese}`;
      eventWrapper.requester_id = taiGerOfficeHoursState.student_id;
      eventWrapper.receiver_id = user._id.toString();
    }
    // e.preventDefault();
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    postEvent(eventWrapper).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        const events_temp = [...taiGerOfficeHoursState.events];
        events_temp.push(data);
        if (success) {
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            selectedEvent: {},
            student_id: '',
            isNewEventModalOpen: false,
            events: data,
            newEvent: {},
            BookButtonDisable: false,
            hasEvents: true,
            isDeleteModalOpen: false,
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setTaiGerOfficeHours((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            selectedEvent: {},
            isNewEventModalOpen: false,
            isDeleteModalOpen: false,
            BookButtonDisable: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setTaiGerOfficeHours((prevState) => ({
          ...prevState,
          error,
          isLoaded: true,
          newDescription: '',
          newReceiver: '',
          isNewEventModalOpen: false,
          selectedEvent: {},
          isDeleteModalOpen: false,
          BookButtonDisable: false
        }));
      }
    );
  };

  const handleUpdateDescription = (e) => {
    const new_description_temp = e.target.value;
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      event_temp: {
        ...prevState.event_temp,
        description: new_description_temp
      }
    }));
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleUpdateTimeSlot = (e) => {
    const new_timeslot_temp = e.target.value;
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      event_temp: {
        ...prevState.event_temp,
        start: new_timeslot_temp
      },
      newEventStart: new_timeslot_temp
    }));
  };

  const handleSelectStudent = (e) => {
    const student_id = e.target.value;
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      student_id: student_id
    }));
  };

  const handleConfirmAppointmentModalClose = () => {
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      isConfirmModalOpen: false
    }));
  };
  const handleEditAppointmentModalClose = () => {
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      isEditModalOpen: false
    }));
  };

  const handleDeleteAppointmentModalClose = () => {
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      isDeleteModalOpen: false
    }));
  };
  const handleConfirmAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      isConfirmModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
  };
  const handleEditAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      isEditModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
  };

  const handleDeleteAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      isDeleteModalOpen: true,
      event_id: event._id.toString()
    }));
  };

  const ConfirmError = () => {
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  // Calendar handler:
  const handleSelectEvent = (event) => {
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      isEditModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
  };
  const handleChange = (e) => {
    const description_temp = e.target.value;
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      newDescription: description_temp
    }));
  };
  const handleModalClose = () => {
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      selectedEvent: {},
      newDescription: '',
      newReceiver: ''
    }));
  };
  const handleChangeReceiver = (e) => {
    const receiver_temp = e.target.value;
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      newReceiver: receiver_temp
    }));
  };

  const handleSelectSlot = (slotInfo) => {
    // When an empty date slot is clicked, open the modal to create a new event
    const Some_Date = new Date(slotInfo.start); //bug
    const year = Some_Date.getFullYear();
    const month = Some_Date.getMonth() + 1;
    const day = Some_Date.getDate();

    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      newEventStart: slotInfo.start,
      newEventEnd: slotInfo.end,
      isNewEventModalOpen: true,
      selected_year: year,
      selected_month: month,
      selected_day: day
    }));
  };

  const handleNewEventModalClose = () => {
    // Close the modal for creating a new event
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      isNewEventModalOpen: false,
      newEventTitle: '',
      newDescription: ''
    }));
  };

  const switchCalendarAndMyBookedEvents = () => {
    setTaiGerOfficeHours((prevState) => ({
      ...prevState,
      hasEvents: !taiGerOfficeHoursState.hasEvents
    }));
  };

  if (user.role !== 'Agent') {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const {
    hasEvents,
    events,
    agents,
    students,
    res_status,
    isLoaded,
    res_modal_status,
    res_modal_message
  } = taiGerOfficeHoursState;

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
  const booked_events = events.map((event) => ({
    ...event,
    id: event._id.toString(),
    start: new Date(event.start),
    end: new Date(event.end),
    provider: event.requester_id[0]
  }));
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
            {t('To Calendar')}
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
            <Typography variant="h6">{t('Upcoming')}</Typography>
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
                : 'No upcoming event'}
            </Box>
          </Card>
          <Card>
            <Typography variant="h6">Past</Typography>
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
            open={taiGerOfficeHoursState.isConfirmModalOpen}
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
                taiGerOfficeHoursState.event_id === '' ||
                taiGerOfficeHoursState.event_temp?.description?.length === 0 ||
                taiGerOfficeHoursState.BookButtonDisable
              }
              onClick={(e) =>
                handleConfirmAppointmentModal(
                  e,
                  taiGerOfficeHoursState.event_id,
                  taiGerOfficeHoursState.event_temp
                )
              }
            >
              {taiGerOfficeHoursState.BookButtonDisable ? (
                <CircularProgress size={16} />
              ) : (
                <>
                  <AiFillCheckCircle color="limegreen" size={16} /> {t('Yes')}
                </>
              )}
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              size="small"
              onClick={handleConfirmAppointmentModalClose}
            >
              {t('Close')}
            </Button>
          </ModalNew>
          <ModalNew
            open={taiGerOfficeHoursState.isDeleteModalOpen}
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
              disabled={
                taiGerOfficeHoursState.event_id === '' ||
                taiGerOfficeHoursState.BookButtonDisable
              }
              onClick={(e) =>
                handleDeleteAppointmentModal(e, taiGerOfficeHoursState.event_id)
              }
            >
              {taiGerOfficeHoursState.BookButtonDisable ? (
                <CircularProgress size={16} />
              ) : (
                t('Delete')
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
                handleSelectSlot={handleSelectSlot}
                handleSelectStudent={handleSelectStudent}
                student_id={taiGerOfficeHoursState.student_id}
                handleNewEventModalClose={handleNewEventModalClose}
                handleModalBook={handleModalBook}
                handleModalCreateEvent={handleModalCreateEvent}
                newReceiver={taiGerOfficeHoursState.newReceiver}
                newDescription={taiGerOfficeHoursState.newDescription}
                selectedEvent={taiGerOfficeHoursState.selectedEvent}
                newEventStart={taiGerOfficeHoursState.newEventStart}
                newEventEnd={taiGerOfficeHoursState.newEventEnd}
                newEventTitle={taiGerOfficeHoursState.newEventTitle}
                selected_year={taiGerOfficeHoursState.selected_year}
                selected_month={taiGerOfficeHoursState.selected_month}
                selected_day={taiGerOfficeHoursState.selected_day}
                students={taiGerOfficeHoursState.students}
                isNewEventModalOpen={taiGerOfficeHoursState.isNewEventModalOpen}
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
        open={taiGerOfficeHoursState.isEditModalOpen}
        onClose={handleEditAppointmentModalClose}
        size="lg"
      >
        <Typography variant="h6">{t('Edit')}</Typography>
        <TextField
          type="textarea"
          maxLength={2000}
          label="請寫下想討論的主題"
          rows="10"
          placeholder="Example：我想定案選校、選課，我想討論簽證，德語班。"
          value={taiGerOfficeHoursState.event_temp.description || ''}
          isInvalid={
            taiGerOfficeHoursState.event_temp.description?.length > 2000
          }
          onChange={(e) => handleUpdateDescription(e)}
        />
        <Badge
          bg={`${
            taiGerOfficeHoursState.event_temp.description?.length > 2000
              ? 'danger'
              : 'primary'
          }`}
        >
          {taiGerOfficeHoursState.event_temp.description?.length || 0}/{2000}
        </Badge>
        <Typography variant="body1">Student: </Typography>
        {taiGerOfficeHoursState.event_temp?.requester_id?.map(
          (requester, idx) => (
            <Typography fontWeight="bold" key={idx}>
              {requester.firstname} {requester.lastname}
            </Typography>
          )
        )}
        <Typography>
          Time zone: {user.timezone}. (Please update it in{' '}
          <a href="/profile" target="_blank">
            Profile
          </a>
          )
        </Typography>
        <br />
        <Form>
          <Form.Label>Time Slot</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => handleUpdateTimeSlot(e)}
            value={new Date(taiGerOfficeHoursState.event_temp.start)}
          >
            {available_termins
              .sort((a, b) => (a.start < b.start ? -1 : 1))
              .map((time_slot) => (
                <option value={`${time_slot.start}`} key={`${time_slot.start}`}>
                  {time_slot.start.toLocaleString()} to{' '}
                  {time_slot.end.toLocaleString()}
                </option>
              ))}
          </Form.Control>
        </Form>
        <Button
          color="secondary"
          variant="outlined"
          size="small"
          disabled={
            taiGerOfficeHoursState.event_id === '' ||
            taiGerOfficeHoursState.event_temp?.description?.length === 0 ||
            taiGerOfficeHoursState.BookButtonDisable
          }
          onClick={(e) =>
            handleEditAppointmentModal(
              e,
              taiGerOfficeHoursState.event_id,
              taiGerOfficeHoursState.event_temp
            )
          }
        >
          {taiGerOfficeHoursState.BookButtonDisable ? (
            <CircularProgress size={16} />
          ) : (
            t('Update')
          )}
        </Button>
      </ModalNew>
    </Box>
  );
}

export default TaiGerOfficeHours;
