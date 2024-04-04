import React, { useEffect, useState } from 'react';
import {
  Box,
  Badge,
  Button,
  Breadcrumbs,
  Card,
  CircularProgress,
  Link,
  Tabs,
  Tab,
  Typography,
  TextField
} from '@mui/material';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

import {
  // getNextDayDate,
  // getTodayAsWeekday,
  // getReorderWeekday,
  // shiftDateByOffset,
  // getTimezoneOffset,
  isInTheFuture
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  confirmEvent,
  deleteEvent,
  getAllEvents,
  postEvent,
  updateEvent
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import {
  is_TaiGer_Agent,
  is_TaiGer_role,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import EventConfirmationCard from '../../components/Calendar/components/EventConfirmationCard';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';

function AllOfficeHours() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [allOfficeHoursState, setAllOfficeHoursState] = useState({
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
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    getAllEvents().then(
      (resp) => {
        const { data, agents, hasEvents, students, success } = resp.data;
        const { status } = resp;
        if (success) {
          setAllOfficeHoursState((prevState) => ({
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
          setAllOfficeHoursState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setAllOfficeHoursState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleConfirmAppointmentModal = (e, event_id, updated_event) => {
    e.preventDefault();
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    confirmEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        const temp_events = [...allOfficeHoursState.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        if (success) {
          setAllOfficeHoursState((prevState) => ({
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
          setAllOfficeHoursState((prevState) => ({
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
        setAllOfficeHoursState((prevState) => ({
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
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    updateEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        let temp_events = [...allOfficeHoursState.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        if (success) {
          setAllOfficeHoursState((prevState) => ({
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
          setAllOfficeHoursState((prevState) => ({
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
        setAllOfficeHoursState((prevState) => ({
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
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    deleteEvent(event_id).then(
      (resp) => {
        const { data, agents, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          setAllOfficeHoursState((prevState) => ({
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
          setAllOfficeHoursState((prevState) => ({
            ...prevState,
            isLoaded: true,
            event_id: '',
            res_status: status
          }));
        }
      },
      (error) => {
        setAllOfficeHoursState((prevState) => ({
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
    const eventWrapper = { ...allOfficeHoursState.selectedEvent };
    if (is_TaiGer_Student(user)) {
      eventWrapper.requester_id = user._id.toString();
      eventWrapper.description = allOfficeHoursState.newDescription;
      eventWrapper.receiver_id = allOfficeHoursState.newReceiver;
    }
    e.preventDefault();
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    postEvent(eventWrapper).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        const events_temp = [...allOfficeHoursState.events];
        events_temp.push(data);
        if (success) {
          setAllOfficeHoursState((prevState) => ({
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
          setAllOfficeHoursState((prevState) => ({
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
        setAllOfficeHoursState((prevState) => ({
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
      const temp_std = allOfficeHoursState.students.find(
        (std) => std._id.toString() === allOfficeHoursState.student_id
      );
      eventWrapper.title = `${temp_std.firstname} ${temp_std.lastname} ${temp_std.firstname_chinese} ${temp_std.lastname_chinese}`;
      eventWrapper.requester_id = allOfficeHoursState.student_id;
      eventWrapper.receiver_id = user._id.toString();
    }
    // e.preventDefault();
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    postEvent(eventWrapper).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        const events_temp = [...allOfficeHoursState.events];
        events_temp.push(data);
        if (success) {
          setAllOfficeHoursState((prevState) => ({
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
          setAllOfficeHoursState((prevState) => ({
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
        setAllOfficeHoursState((prevState) => ({
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
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      event_temp: {
        ...prevState.event_temp,
        description: new_description_temp
      }
    }));
  };

  const handleUpdateTimeSlot = (e) => {
    const new_timeslot_temp = e.target.value;
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      event_temp: { ...prevState.event_temp, start: new_timeslot_temp },
      newEventStart: new_timeslot_temp
    }));
  };

  const handleSelectStudent = (e) => {
    const student_id = e.target.value;
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      student_id: student_id
    }));
  };

  const handleConfirmAppointmentModalClose = () => {
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      isConfirmModalOpen: false
    }));
  };
  const handleEditAppointmentModalClose = () => {
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      isEditModalOpen: false
    }));
  };

  const handleDeleteAppointmentModalClose = () => {
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      isDeleteModalOpen: false
    }));
  };
  const handleConfirmAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      isConfirmModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
  };
  const handleEditAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      isEditModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
  };

  const handleDeleteAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      isDeleteModalOpen: true,
      event_id: event._id.toString()
    }));
  };

  const ConfirmError = () => {
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  // Calendar handler:
  const handleSelectEvent = (event) => {
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      isEditModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
    // setAllOfficeHoursState({
    //   selectedEvent: event,
    //   newDescription: event.description || ''
    // });
  };
  const handleChange = (e) => {
    const description_temp = e.target.value;
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      newDescription: description_temp
    }));
  };
  const handleModalClose = () => {
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      selectedEvent: {},
      newDescription: '',
      newReceiver: ''
    }));
  };
  const handleChangeReceiver = (e) => {
    const receiver_temp = e.target.value;
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      newReceiver: receiver_temp
    }));
  };

  const handleSelectSlot = (slotInfo) => {
    // When an empty date slot is clicked, open the modal to create a new event
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      newEventStart: slotInfo.start,
      newEventEnd: slotInfo.end,
      isNewEventModalOpen: true
    }));
  };

  const handleNewEventModalClose = () => {
    // Close the modal for creating a new event
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      isNewEventModalOpen: false,
      newEventTitle: '',
      newDescription: ''
    }));
  };

  const switchCalendarAndMyBookedEvents = () => {
    setAllOfficeHoursState((prevState) => ({
      ...prevState,
      hasEvents: !prevState.hasEvents
    }));
  };

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const {
    hasEvents,
    events,
    students,
    res_status,
    isLoaded,
    res_modal_status,
    res_modal_message
  } = allOfficeHoursState;

  if (!isLoaded || !students) {
    return <Loading />;
  }
  TabTitle(`Office Hours`);
  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  // const getReorderWeekday(getTodayAsWeekday(agent.timezone)) = getReorderWeekday(
  //   getTodayAsWeekday(allOfficeHoursState.agent.timezone)
  // );
  //TODO: remove the conflicting time slots.
  // (in Testing again) TODO: bug >> browser dependent!
  // const available_termins = [0, 1, 2, 3].flatMap((iter, x) =>
  //   agents.flatMap((agent, idx) =>
  //     // BUG: getReorderWeekday(getTodayAsWeekday(agent.timezone)) cause wrong time in correct date.
  //     // David on Thursday, getReorderWeekday start from Tuesday, and the timeslot it from tuesday (date: saturday but time: tuesday)
  //     getReorderWeekday(getTodayAsWeekday(agent.timezone)).flatMap(
  //       (weekday, i) => {
  //         // observe: look like weekday is wrong should be saturday, but it starting from tuesday
  //         const timeSlots =
  //           agent.officehours &&
  //           agent.officehours[weekday]?.active &&
  //           agent.officehours[weekday].time_slots.flatMap((time_slot, j) => {
  //             const { year, month, day } = getNextDayDate(
  //               getReorderWeekday(getTodayAsWeekday(agent.timezone)),
  //               weekday,
  //               agent.timezone,
  //               iter
  //             );
  //             const hour = parseInt(time_slot.value.split(':')[0], 10);
  //             const minutes = parseInt(time_slot.value.split(':')[1], 10);
  //             const time_difference =
  //               getTimezoneOffset(
  //                 Intl.DateTimeFormat().resolvedOptions().timeZone
  //               ) - getTimezoneOffset(agent.timezone);
  //             return {
  //               id: j * 10 + i * 100 + x * 1000 + 1,
  //               title: `${(hour + time_difference) % 24}:${
  //                 time_slot.value.split(':')[1]
  //               }`,
  //               start: shiftDateByOffset(
  //                 new Date(year, month - 1, day, hour, minutes),
  //                 time_difference
  //               ),
  //               end: shiftDateByOffset(
  //                 new Date(year, month - 1, day, hour, minutes),
  //                 time_difference + 0.5
  //               ),
  //               provider: agent
  //             };
  //           });
  //         return timeSlots || [];
  //       }
  //     )
  //   )
  // );
  const booked_events = events.map((event) => ({
    ...event,
    id: event._id.toString(),
    start: new Date(event.start),
    end: new Date(event.end),
    provider: event.requester_id[0] || { firstname: 'TBD', lastname: 'TBD' }
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
        <Typography color="text.primary">All Events</Typography>
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
                  .sort((a, b) => a.start - b.start)
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
          </Card>
          <Card>
            <Typography variant="h6">{t('Past')}</Typography>
            {events
              ?.filter((event) => !isInTheFuture(event.end))
              .sort((a, b) => a.start > b.start)
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
          </Card>
          <ModalNew
            open={allOfficeHoursState.isConfirmModalOpen}
            onClose={handleConfirmAppointmentModalClose}
          >
            <Typography variant="string">
              You are aware of this meeting time and confirm.
            </Typography>
            <Button
              color="primary"
              variant="contained"
              disabled={
                allOfficeHoursState.event_id === '' ||
                allOfficeHoursState.event_temp?.description?.length === 0 ||
                allOfficeHoursState.BookButtonDisable
              }
              onClick={(e) =>
                handleConfirmAppointmentModal(
                  e,
                  allOfficeHoursState.event_id,
                  allOfficeHoursState.event_temp
                )
              }
            >
              {allOfficeHoursState.BookButtonDisable ? (
                <CircularProgress size={16} />
              ) : (
                <>
                  <AiFillCheckCircle color="limegreen" size={16} />{' '}
                  {t('Yes', { ns: 'common' })}
                </>
              )}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleConfirmAppointmentModalClose}
            >
              {t('Close', { ns: 'common' })}
            </Button>
          </ModalNew>
          <ModalNew
            open={allOfficeHoursState.isDeleteModalOpen}
            onClose={handleDeleteAppointmentModalClose}
            centered
            size="lg"
          >
            <Typography variant="string">
              {t('Do you want to cancel this meeting?')}
            </Typography>
            <br />
            <Button
              color="primary"
              variant="contained"
              disabled={
                allOfficeHoursState.event_id === '' ||
                allOfficeHoursState.BookButtonDisable
              }
              onClick={(e) =>
                handleDeleteAppointmentModal(e, allOfficeHoursState.event_id)
              }
            >
              {allOfficeHoursState.BookButtonDisable ? (
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
            onClick={switchCalendarAndMyBookedEvents}
            size="sm"
          >
            {t('All Appointments')}
          </Button>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="primary"
                aria-label="basic tabs example"
              >
                <Tab label={t('Calendar')} {...a11yProps(0)} />
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
                student_id={allOfficeHoursState.student_id}
                handleNewEventModalClose={handleNewEventModalClose}
                handleModalBook={handleModalBook}
                handleModalCreateEvent={handleModalCreateEvent}
                newReceiver={allOfficeHoursState.newReceiver}
                newDescription={allOfficeHoursState.newDescription}
                selectedEvent={allOfficeHoursState.selectedEvent}
                newEventStart={allOfficeHoursState.newEventStart}
                newEventEnd={allOfficeHoursState.newEventEnd}
                newEventTitle={allOfficeHoursState.newEventTitle}
                students={allOfficeHoursState.students}
                isNewEventModalOpen={allOfficeHoursState.isNewEventModalOpen}
              />
            </CustomTabPanel>
          </Card>
        </>
      )}
      <ModalNew
        open={allOfficeHoursState.isEditModalOpen}
        onClose={handleEditAppointmentModalClose}
        size="xl"
        centered
      >
        <Typography variant="h6">{t('Edit', { ns: 'common' })}</Typography>
        <Typography>請寫下想討論的主題</Typography>
        <TextField
          fullWidth
          type="textarea"
          inputProps={{ maxLength: 2000 }}
          multiline
          minRows={10}
          placeholder="Example：我想定案選校、選課，我想討論簽證，德語班。"
          value={allOfficeHoursState.event_temp.description || ''}
          isInvalid={allOfficeHoursState.event_temp.description?.length > 2000}
          onChange={(e) => handleUpdateDescription(e)}
        ></TextField>
        <Badge
          bg={`${
            allOfficeHoursState.event_temp.description?.length > 2000
              ? 'danger'
              : 'primary'
          }`}
        >
          {allOfficeHoursState.event_temp.description?.length || 0}/{2000}
        </Badge>
        <Typography>
          Student:{' '}
          {allOfficeHoursState.event_temp?.requester_id?.map(
            (requester, idx) => (
              <Typography fontWeight="bold" key={idx}>
                {requester.firstname} {requester.lastname}
              </Typography>
            )
          )}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          disabled={
            allOfficeHoursState.event_id === '' ||
            allOfficeHoursState.event_temp?.description?.length === 0 ||
            allOfficeHoursState.BookButtonDisable
          }
          onClick={(e) =>
            handleEditAppointmentModal(
              e,
              allOfficeHoursState.event_id,
              allOfficeHoursState.event_temp
            )
          }
        >
          {allOfficeHoursState.BookButtonDisable ? (
            <CircularProgress size={16} />
          ) : (
            t('Update', { ns: 'common' })
          )}
        </Button>
      </ModalNew>
    </Box>
  );
}

export default AllOfficeHours;
