import React, { useState } from 'react';
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
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { isInTheFuture } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import { is_TaiGer_role } from '../Utils/checking-functions';
import EventConfirmationCard from '../../components/Calendar/components/EventConfirmationCard';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import useCalendarEvents from '../../hooks/useCalendarEvents';

function AllOfficeHours() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const {
    events,
    hasEvents,
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
    student_id,
    students,
    handleConfirmAppointmentModalOpen,
    handleEditAppointmentModalOpen,
    handleModalBook,
    handleUpdateDescription,
    handleEditAppointmentModal,
    handleConfirmAppointmentModal,
    handleDeleteAppointmentModal,
    handleUpdateTimeSlotAgent,
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
    handleModalCreateEvent,
    handleSelectStudent,
    res_modal_message,
    res_modal_status,
    ConfirmError
  } = useCalendarEvents({ user_id: '', isAll: true });

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  if (!isLoaded || !students) {
    return <Loading />;
  }
  TabTitle(`Office Hours`);
  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

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
            {t('To Calendar', { ns: 'common' })}
          </Button>
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
                    (!event.isConfirmedReceiver || !event.isConfirmedRequester)
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
                handleEditAppointmentModalOpen={handleEditAppointmentModalOpen}
                handleDeleteAppointmentModalOpen={
                  handleDeleteAppointmentModalOpen
                }
              />
            ))}
          <Card>
            <Typography variant="h6">
              {t('Upcoming', { ns: 'common' })}
            </Typography>
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
          </Card>
          <Card>
            <Typography variant="h6">{t('Past', { ns: 'common' })}</Typography>
            {_.reverse(
              _.sortBy(
                events?.filter((event) => !isInTheFuture(event.end)),
                ['start']
              )
            ).map((event, i) => (
              <EventConfirmationCard
                key={i}
                event={event}
                handleConfirmAppointmentModalOpen={
                  handleConfirmAppointmentModalOpen
                }
                handleEditAppointmentModalOpen={handleEditAppointmentModalOpen}
                handleDeleteAppointmentModalOpen={
                  handleDeleteAppointmentModalOpen
                }
                disabled={true}
              />
            ))}
          </Card>
          <ModalNew
            open={isConfirmModalOpen}
            onClose={handleConfirmAppointmentModalClose}
          >
            <Typography variant="string">
              You are aware of this meeting time and confirm.
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
              variant="outlined"
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
            <Typography variant="string">
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
                handleSelectEvent={handleSelectEvent}
                handleUpdateTimeSlot={handleUpdateTimeSlotAgent}
                handleChange={handleChange}
                handleModalClose={handleModalClose}
                handleChangeReceiver={handleChangeReceiver}
                handleSelectSlot={handleSelectSlot}
                handleSelectStudent={handleSelectStudent}
                student_id={student_id}
                handleNewEventModalClose={handleNewEventModalClose}
                handleModalBook={handleModalBook}
                handleModalCreateEvent={handleModalCreateEvent}
                newReceiver={newReceiver}
                newDescription={newDescription}
                selectedEvent={selectedEvent}
                newEventStart={newEventStart}
                newEventEnd={newEventEnd}
                students={students}
                isNewEventModalOpen={isNewEventModalOpen}
              />
            </CustomTabPanel>
          </Card>
        </>
      )}
      <ModalNew
        open={isEditModalOpen}
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
          value={event_temp.description || ''}
          isInvalid={event_temp.description?.length > 2000}
          onChange={(e) => handleUpdateDescription(e)}
        ></TextField>
        <Badge
          bg={`${event_temp.description?.length > 2000 ? 'danger' : 'primary'}`}
        >
          {event_temp.description?.length || 0}/{2000}
        </Badge>
        <Typography>
          Student:{' '}
          {event_temp?.requester_id?.map((requester, idx) => (
            <Typography fontWeight="bold" key={idx}>
              {requester.firstname} {requester.lastname}
            </Typography>
          ))}
        </Typography>
        <Button
          color="primary"
          variant="contained"
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
    </Box>
  );
}

export default AllOfficeHours;
