import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
  Link,
  Breadcrumbs,
  TextField,
  Badge,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import moment from 'moment-timezone';
import { Navigate, useParams, Link as LinkDom } from 'react-router-dom';
import {
  AiFillCheckCircle,
  AiOutlineMail,
  AiOutlineUser
} from 'react-icons/ai';
import PropTypes from 'prop-types';

import {
  getNextDayDate,
  getTodayAsWeekday,
  getReorderWeekday,
  shiftDateByOffset,
  getTimezoneOffset,
  getNumberOfDays,
  isInTheFuture,
  getUTCWithDST
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import Banner from '../../components/Banner/Banner';
import {
  confirmEvent,
  deleteEvent,
  getEvents,
  postEvent,
  updateEvent
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import { is_TaiGer_Student } from '../Utils/checking-functions';

import EventConfirmationCard from '../../components/Calendar/components/EventConfirmationCard';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';
import ModalNew from '../../components/Modal';
import { appConfig } from '../../config';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function OfficeHours() {
  const { user } = useAuth();
  const { user_id } = useParams();
  const { t } = useTranslation();
  const [OfficeHoursState, setOfficeHoursState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    agents: {},
    hasEvents: false,
    isDeleteModalOpen: false,
    isEditModalOpen: false,
    isConfirmModalOpen: false,
    event_temp: {},
    event_id: '',
    booked_events: [],
    selectedEvent: {},
    newReceiver: '',
    BookButtonDisable: false,
    newDescription: '',
    newEventTitle: '',
    newEventStart: null,
    newEventEnd: null,
    isNewEventModalOpen: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });
  const [value, setValue] = useState(0);

  useEffect(() => {
    getEvents().then(
      (resp) => {
        const { data, agents, booked_events, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          setOfficeHoursState((prevState) => ({
            ...prevState,
            isLoaded: true,
            agents,
            hasEvents,
            events: data,
            booked_events,
            success: success,
            res_status: status
          }));
        } else {
          setOfficeHoursState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setOfficeHoursState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [user_id]);

  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };

  const handleConfirmAppointmentModal = (e, event_id, updated_event) => {
    e.preventDefault();
    setOfficeHoursState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    confirmEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        const temp_events = [...OfficeHoursState.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        if (success) {
          setOfficeHoursState((prevState) => ({
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
          setOfficeHoursState((prevState) => ({
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
        setOfficeHoursState((prevState) => ({
          ...prevState,
          isLoaded: true,
          BookButtonDisable: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  const handleEditAppointmentModal = (e, event_id, updated_event) => {
    e.preventDefault();
    setOfficeHoursState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    updateEvent(event_id, updated_event).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        const temp_events = [...OfficeHoursState.events];
        let found_event_idx = temp_events.findIndex(
          (temp_event) => temp_event._id.toString() === event_id
        );
        if (found_event_idx >= 0) {
          temp_events[found_event_idx] = data;
        }
        if (success) {
          setOfficeHoursState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isEditModalOpen: false,
            BookButtonDisable: false,
            events: temp_events,
            event_id: '',
            isDeleteModalOpen: false,
            success: success,
            res_status: status
          }));
        } else {
          setOfficeHoursState((prevState) => ({
            ...prevState,
            isLoaded: true,
            BookButtonDisable: false,
            event_id: '',
            res_status: status
          }));
        }
      },
      (error) => {
        setOfficeHoursState((prevState) => ({
          ...prevState,
          isLoaded: true,
          BookButtonDisable: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  const handleDeleteAppointmentModal = (e, event_id) => {
    e.preventDefault();
    setOfficeHoursState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    deleteEvent(event_id).then(
      (resp) => {
        const { data, agents, hasEvents, success } = resp.data;
        const { status } = resp;
        if (success) {
          setOfficeHoursState((prevState) => ({
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
          setOfficeHoursState((prevState) => ({
            ...prevState,
            isLoaded: true,
            event_id: '',
            BookButtonDisable: false,
            res_status: status
          }));
        }
      },
      (error) => {
        setOfficeHoursState((prevState) => ({
          ...prevState,
          isLoaded: true,
          BookButtonDisable: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  const handleModalBook = (e) => {
    e.preventDefault();
    setOfficeHoursState((prevState) => ({
      ...prevState,
      BookButtonDisable: true
    }));
    const eventWrapper = { ...OfficeHoursState.selectedEvent };
    if (is_TaiGer_Student(user)) {
      eventWrapper.requester_id = user._id.toString();
      eventWrapper.description = OfficeHoursState.newDescription;
      eventWrapper.receiver_id = OfficeHoursState.newReceiver;
    }
    postEvent(eventWrapper).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        const events_temp = [...OfficeHoursState.events];
        events_temp.push(data);
        if (success) {
          setOfficeHoursState((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            BookButtonDisable: false,
            selectedEvent: {},
            events: data,
            hasEvents: true,
            isDeleteModalOpen: false,
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setOfficeHoursState((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            newDescription: '',
            newReceiver: '',
            BookButtonDisable: false,
            selectedEvent: {},
            isDeleteModalOpen: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setOfficeHoursState((prevState) => ({
          ...prevState,
          error,
          isLoaded: true,
          newDescription: '',
          newReceiver: '',
          BookButtonDisable: false,
          selectedEvent: {},
          isDeleteModalOpen: false,
          res_modal_status: status
        }));
      }
    );
  };

  const handleUpdateDescription = (e) => {
    const new_description_temp = e.target.value;
    setOfficeHoursState((prevState) => ({
      ...prevState,
      event_temp: {
        ...prevState.event_temp,
        description: new_description_temp
      }
    }));
  };

  const handleUpdateTimeSlot = (e) => {
    const new_timeslot_temp = e.target.value;
    setOfficeHoursState((prevState) => ({
      ...prevState,
      event_temp: { ...prevState.event_temp, start: new_timeslot_temp }
    }));
  };

  const handleConfirmAppointmentModalClose = () => {
    setOfficeHoursState((prevState) => ({
      ...prevState,
      isConfirmModalOpen: false
    }));
  };

  const handleEditAppointmentModalClose = () => {
    setOfficeHoursState((prevState) => ({
      ...prevState,
      isEditModalOpen: false
    }));
  };

  const handleDeleteAppointmentModalClose = () => {
    setOfficeHoursState((prevState) => ({
      ...prevState,
      isDeleteModalOpen: false
    }));
  };

  const handleConfirmAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setOfficeHoursState((prevState) => ({
      ...prevState,
      isConfirmModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
  };

  const handleEditAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setOfficeHoursState((prevState) => ({
      ...prevState,
      isEditModalOpen: true,
      event_temp: event,
      event_id: event._id.toString()
    }));
  };

  const handleDeleteAppointmentModalOpen = (e, event) => {
    e.preventDefault();
    e.stopPropagation();
    setOfficeHoursState((prevState) => ({
      ...prevState,
      isDeleteModalOpen: true,
      event_id: event._id.toString()
    }));
  };

  const ConfirmError = () => {
    setOfficeHoursState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  // Calendar handler:
  const handleSelectEvent = (event) => {
    setOfficeHoursState((prevState) => ({
      ...prevState,
      selectedEvent: event
    }));
  };
  const handleChange = (e) => {
    const description_temp = e.target.value;
    setOfficeHoursState((prevState) => ({
      ...prevState,
      newDescription: description_temp
    }));
  };
  const handleModalClose = () => {
    setOfficeHoursState((prevState) => ({
      ...prevState,
      selectedEvent: {},
      newDescription: '',
      newReceiver: ''
    }));
  };
  const handleChangeReceiver = (e) => {
    const receiver_temp = e.target.value;
    setOfficeHoursState((prevState) => ({
      ...prevState,
      newReceiver: receiver_temp
    }));
  };

  const handleSelectSlot = (slotInfo) => {
    // When an empty date slot is clicked, open the modal to create a new event
    setOfficeHoursState((prevState) => ({
      ...prevState,
      newEventStart: slotInfo.start,
      newEventEnd: slotInfo.end,
      isNewEventModalOpen: true
    }));
  };

  const handleNewEventModalClose = () => {
    // Close the modal for creating a new event
    setOfficeHoursState((prevState) => ({
      ...prevState,
      isNewEventModalOpen: false,
      newEventTitle: '',
      newDescription: ''
    }));
  };

  const switchCalendarAndMyBookedEvents = () => {
    setOfficeHoursState((prevState) => ({
      ...prevState,
      hasEvents: !prevState.hasEvents
    }));
  };

  if (user.role !== 'Student') {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const {
    hasEvents,
    events,
    agents,
    booked_events,
    res_status,
    isLoaded,
    res_modal_status,
    res_modal_message
  } = OfficeHoursState;

  if (!isLoaded) {
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
                    const hour = parseInt(time_slot.value.split(':')[0], 10);
                    const minutes = parseInt(time_slot.value.split(':')[1], 10);
                    const time_difference =
                      getTimezoneOffset(
                        Intl.DateTimeFormat().resolvedOptions().timeZone
                      ) - getTimezoneOffset(agent.timezone);
                    const condition = booked_events.some(
                      (booked_event) =>
                        new Date(booked_event.start).toISOString() ===
                        shiftDateByOffset(
                          new Date(year, month - 1, day, hour, minutes),
                          time_difference
                        ).toISOString()
                    );
                    const end_date = new Date(test_date);
                    end_date.setMinutes(end_date.getMinutes() + 30);
                    if (condition) {
                      return [];
                    } else {
                      return {
                        id: j * 10 + i * 100 + x * 1000 + 1,
                        title: `${user.firstname} ${user.lastname} ${
                          user.firstname_chinese || ''
                        } ${user.lastname_chinese || ''}`,
                        start: new Date(test_date),
                        end: end_date,
                        provider: agent
                      };
                    }
                  }
                );
              return timeSlots || [];
            }
          )
        : []
    )
  );

  const has_officehours = available_termins?.length !== 0 ? true : false;
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
        <Typography color="text.primary">Office Hours</Typography>
      </Breadcrumbs>
      {hasEvents ? (
        <>
          <Button
            color="primary"
            variant="contained"
            onClick={switchCalendarAndMyBookedEvents}
          >
            Book an Office Hour
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
            <Box>
              <Typography variant="h6">{t('Upcoming')}</Typography>
              <Typography>
                {events?.filter(
                  (event) =>
                    isInTheFuture(event.end) &&
                    event.isConfirmedReceiver &&
                    event.isConfirmedRequester
                ).length !== 0
                  ? events
                      ?.filter(
                        (event) =>
                          isInTheFuture(event.end) &&
                          event.isConfirmedReceiver &&
                          event.isConfirmedRequester
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
                  : t('No upcoming event')}
              </Typography>
            </Box>
          </Card>
          <Card>
            <Typography variant="h6">Past</Typography>
            <Typography>
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
            </Typography>
          </Card>
          <ModalNew
            open={OfficeHoursState.isConfirmModalOpen}
            onClose={handleConfirmAppointmentModalClose}
            centered
          >
            <Typography variant="body1">
              {t('You are aware of this meeting time and confirm.')}
            </Typography>
            <Button
              color="primary"
              variant="contained"
              disabled={
                OfficeHoursState.event_id === '' ||
                OfficeHoursState.event_temp?.description?.length === 0 ||
                OfficeHoursState.BookButtonDisable
              }
              onClick={(e) =>
                handleConfirmAppointmentModal(
                  e,
                  OfficeHoursState.event_id,
                  OfficeHoursState.event_temp
                )
              }
            >
              {OfficeHoursState.BookButtonDisable ? (
                <CircularProgress size={16} />
              ) : (
                <>
                  <AiFillCheckCircle color="limegreen" size={16} /> {t('Yes')}
                </>
              )}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleConfirmAppointmentModalClose}
            >
              {t('Close', { ns: 'common' })}
            </Button>
          </ModalNew>
          <ModalNew
            open={OfficeHoursState.isEditModalOpen}
            onClose={handleEditAppointmentModalClose}
            centered
            size="large"
          >
            <Typography>請寫下想討論的主題</Typography>
            <TextField
              fullWidth
              type="textarea"
              inputProps={{ maxLength: 2000 }}
              multiline
              minRows={5}
              placeholder="Example：我想定案選校、選課，我想討論簽證，德語班。"
              value={OfficeHoursState.event_temp.description || ''}
              isInvalid={OfficeHoursState.event_temp.description?.length > 2000}
              onChange={(e) => handleUpdateDescription(e)}
            ></TextField>

            <Badge
              bg={`${
                OfficeHoursState.event_temp.description?.length > 2000
                  ? 'danger'
                  : 'primary'
              }`}
            >
              {OfficeHoursState.event_temp.description?.length || 0}/{2000}
            </Badge>
            <Typography>
              <AiOutlineUser size={16} />
              Agent:{' '}
              {OfficeHoursState.event_temp.receiver_id?.map((receiver, x) => (
                <span key={x}>
                  {receiver.firstname} {receiver.lastname}{' '}
                  <AiOutlineMail ize={16} /> {receiver.email}
                </span>
              ))}
            </Typography>
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="Time_Slot">{t('Time Slot')}</InputLabel>
              <Select
                size="small"
                id="time_slot"
                onChange={(e) => handleUpdateTimeSlot(e)}
                value={new Date(OfficeHoursState.event_temp.start)}
              >
                {available_termins
                  .sort((a, b) => (a.start < b.start ? -1 : 1))
                  .filter((event) =>
                    OfficeHoursState.event_temp?.receiver_id?.some(
                      (r_id) =>
                        event.provider?._id?.toString() ===
                        r_id?._id?.toString()
                    )
                  )
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
              color="primary"
              variant="contained"
              disabled={
                OfficeHoursState.event_id === '' ||
                OfficeHoursState.event_temp?.description?.length === 0 ||
                OfficeHoursState.BookButtonDisable
              }
              onClick={(e) =>
                handleEditAppointmentModal(
                  e,
                  OfficeHoursState.event_id,
                  OfficeHoursState.event_temp
                )
              }
            >
              {OfficeHoursState.BookButtonDisable ? (
                <CircularProgress size={16} />
              ) : (
                t('Update')
              )}
            </Button>
          </ModalNew>
          <ModalNew
            open={OfficeHoursState.isDeleteModalOpen}
            onClose={handleDeleteAppointmentModalClose}
            centered
            size="large"
          >
            <Typography variant="body1">
              {t('Do you want to cancel this meeting?')}
            </Typography>
            <br />
            <Button
              color="primary"
              variant="contained"
              disabled={
                OfficeHoursState.event_id === '' ||
                OfficeHoursState.BookButtonDisable
              }
              onClick={(e) =>
                handleDeleteAppointmentModal(e, OfficeHoursState.event_id)
              }
            >
              {OfficeHoursState.BookButtonDisable ? (
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
            color="primary"
            variant="contained"
            onClick={switchCalendarAndMyBookedEvents}
          >
            {t('My Appointments')}
          </Button>
          <Box>
            <Card sx={{ p: 2, my: 2 }}>
              <Typography variant="h6">{t('Office Hours')}</Typography>
              <Typography variant="body1">{t('Note')}</Typography>
              <Typography variant="body2">
                請一次只能約一個時段。為了有效率的討論，請詳述您的問題，並讓
                Agent 有時間消化。
              </Typography>
            </Card>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChangeValue}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="basic tabs example"
            >
              <Tab label="Calender" {...a11yProps(0)} />
              <Tab label="My Events" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {/* {'Only boo'} */}
            {events?.filter(
              (event) => getNumberOfDays(new Date(), event.start) >= -1
            ).length !== 0 && (
              <Banner
                ReadOnlyMode={true}
                bg={'primary'}
                title={'info'}
                path={'/'}
                text={<>在您目前預訂的時段過後，您將可以再次預約時段。</>}
                link_name={''}
                removeBanner={<></>}
                notification_key={undefined}
              />
            )}
            {!has_officehours && (
              <Banner
                ReadOnlyMode={true}
                bg={'primary'}
                title={'info'}
                path={'/'}
                text={
                  <>目前 Agent 無空出 Office hours 時段，請聯繫您的 Agent。</>
                }
                link_name={''}
                removeBanner={<></>}
                notification_key={undefined}
              />
            )}
            <MyCalendar
              events={
                // events?.filter(
                //   (event) =>
                //     getNumberOfDays(new Date(), event.start) >= -1
                // ).length !== 0
                //   ? []
                //   :
                [...available_termins]
              }
              user={user}
              handleSelectEvent={handleSelectEvent}
              handleUpdateTimeSlot={handleUpdateTimeSlot}
              handleChange={handleChange}
              handleModalClose={handleModalClose}
              handleChangeReceiver={handleChangeReceiver}
              handleSelectSlot={handleSelectSlot}
              handleNewEventModalClose={handleNewEventModalClose}
              handleModalBook={handleModalBook}
              BookButtonDisable={OfficeHoursState.BookButtonDisable}
              newReceiver={OfficeHoursState.newReceiver}
              newDescription={OfficeHoursState.newDescription}
              selectedEvent={OfficeHoursState.selectedEvent}
              newEventStart={OfficeHoursState.newEventStart}
              newEventEnd={OfficeHoursState.newEventEnd}
              newEventTitle={OfficeHoursState.newEventTitle}
              isNewEventModalOpen={OfficeHoursState.isNewEventModalOpen}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {available_termins
              .sort((a, b) => (a.start < b.start ? -1 : 1))
              .map((time_slot, j) => (
                <Card key={j} className="my-0 mx-0">
                  <Typography variant="h6">
                    {time_slot.start?.toLocaleString()} to{' '}
                    {time_slot.end?.toLocaleString()}
                  </Typography>
                </Card>
              ))}
          </CustomTabPanel>
        </>
      )}
    </Box>
  );
}

export default OfficeHours;
