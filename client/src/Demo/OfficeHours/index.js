import React, { useState } from 'react';
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
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';

import { AiOutlineMail } from 'react-icons/ai';
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
import useCalendarEvents from '../../hooks/useCalendarEvents';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function OfficeHours() {
  const { user } = useAuth();
  const { user_id } = useParams();
  const { t } = useTranslation();
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
    newEventEnd,
    isNewEventModalOpen,
    isDeleteModalOpen,
    handleConfirmAppointmentModalOpen,
    handleEditAppointmentModalOpen,
    handleModalBook,
    handleUpdateDescription,
    handleEditAppointmentModal,
    handleConfirmAppointmentModal,
    handleDeleteAppointmentModal,
    handleUpdateTimeSlot,
    handleConfirmAppointmentModalClose,
    handleEditAppointmentModalClose,
    handleDeleteAppointmentModalClose,
    handleDeleteAppointmentModalOpen,
    handleModalClose,
    handleChangeReceiver,
    handleSelectEvent,
    handleChange,
    handleSelectSlot,
    handleNewEventModalClose,
    switchCalendarAndMyBookedEvents,
    res_modal_message,
    res_modal_status,
    ConfirmError
  } = useCalendarEvents({ user_id });

  const [value, setValue] = useState(0);

  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };

  if (!is_TaiGer_Student(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

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
                          ).toISOString() &&
                        booked_event.receiver_id?.some(
                          (receiver) => receiver._id === agent._id
                        )
                    );
                    const end_date = new Date(test_date);
                    end_date.setMinutes(end_date.getMinutes() + 30);
                    const available_time_slot = {
                      id: j * 10 + i * 100 + x * 1000 + 1,
                      title: `${user.firstname} ${user.lastname} ${
                        user.firstname_chinese || ''
                      } ${user.lastname_chinese || ''}`,
                      start: new Date(test_date),
                      end: end_date,
                      provider: agent
                    };
                    if (condition) {
                      return [];
                    } else {
                      return available_time_slot;
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
              <Typography variant="h6">
                {t('Upcoming', { ns: 'common' })}
              </Typography>
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
              </Typography>
            </Box>
          </Card>
          <Card>
            <Typography variant="h6">{t('Past', { ns: 'common' })}</Typography>
            <Typography>
              {events
                ?.filter((event) => !isInTheFuture(event.end))
                .map((event, i) => (
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
            </Typography>
          </Card>
          <ModalNew
            open={isConfirmModalOpen}
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
              color="primary"
              variant="contained"
              onClick={handleConfirmAppointmentModalClose}
            >
              {t('Close', { ns: 'common' })}
            </Button>
          </ModalNew>
          <ModalNew
            open={isEditModalOpen}
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
              value={event_temp.description || ''}
              isInvalid={event_temp.description?.length > 2000}
              onChange={(e) => handleUpdateDescription(e)}
            ></TextField>

            <Badge
              bg={`${
                event_temp.description?.length > 2000 ? 'danger' : 'primary'
              }`}
            >
              {event_temp.description?.length || 0}/{2000}
            </Badge>
            <Typography>
              <PersonIcon fontSize="small" />
              Agent:{' '}
              {event_temp.receiver_id?.map((receiver, x) => (
                <span key={x}>
                  {receiver.firstname} {receiver.lastname}{' '}
                  <AiOutlineMail ize={16} /> {receiver.email}
                </span>
              ))}
            </Typography>
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="Time_Slot">
                {t('Time Slot', { ns: 'common' })}
              </InputLabel>
              <Select
                size="small"
                id="time_slot"
                onChange={(e) => handleUpdateTimeSlot(e)}
                value={new Date(event_temp.start)}
              >
                {available_termins
                  .sort((a, b) => (a.start < b.start ? -1 : 1))
                  .filter((event) =>
                    event_temp?.receiver_id?.some(
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
                event_id === '' ||
                event_temp?.description?.length === 0 ||
                BookButtonDisable
              }
              onClick={(e) =>
                handleEditAppointmentModal(e, event_id, event_temp)
              }
            >
              {BookButtonDisable ? (
                <CircularProgress size={16} />
              ) : (
                t('Update', { ns: 'common' })
              )}
            </Button>
          </ModalNew>
          <ModalNew
            open={isDeleteModalOpen}
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
              events={[...available_termins]}
              handleSelectEvent={handleSelectEvent}
              handleUpdateTimeSlot={handleUpdateTimeSlot}
              handleChange={handleChange}
              handleModalClose={handleModalClose}
              handleChangeReceiver={handleChangeReceiver}
              handleSelectSlot={handleSelectSlot}
              handleNewEventModalClose={handleNewEventModalClose}
              handleModalBook={handleModalBook}
              BookButtonDisable={BookButtonDisable}
              newReceiver={newReceiver}
              newDescription={newDescription}
              selectedEvent={selectedEvent}
              newEventEnd={newEventEnd}
              isNewEventModalOpen={isNewEventModalOpen}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {available_termins
              .sort((a, b) => (a.start < b.start ? -1 : 1))
              .map((time_slot, j) => (
                <Card key={j}>
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
