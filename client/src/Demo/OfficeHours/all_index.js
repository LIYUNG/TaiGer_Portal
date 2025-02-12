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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { is_TaiGer_role } from '@taiger-common/core';

import { isInTheFuture } from '../../utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import MyCalendar from '../../components/Calendar/components/Calendar';
import EventConfirmationCard from '../../components/Calendar/components/EventConfirmationCard';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import useCalendarEvents from '../../hooks/useCalendarEvents';

const AllOfficeHours = () => {
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
        provider: event.requester_id?.[0] || {
            firstname: 'TBD',
            lastname: 'TBD'
        }
    }));

    return (
        <Box>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Typography color="text.primary">
                    {t('All Students', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                    {t('Calendar Events', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            {hasEvents ? (
                <>
                    <Button
                        color="secondary"
                        onClick={switchCalendarAndMyBookedEvents}
                        size="small"
                        variant="contained"
                    >
                        {t('To Calendar', { ns: 'common' })}
                    </Button>
                    {events?.filter(
                        (event) =>
                            isInTheFuture(event.end) &&
                            (!event.isConfirmedReceiver ||
                                !event.isConfirmedRequester)
                    ).length !== 0
                        ? _.reverse(
                              _.sortBy(
                                  events?.filter(
                                      (event) =>
                                          isInTheFuture(event.end) &&
                                          (!event.isConfirmedReceiver ||
                                              !event.isConfirmedRequester)
                                  ),
                                  ['start']
                              )
                          ).map((event, i) => (
                              <EventConfirmationCard
                                  event={event}
                                  handleConfirmAppointmentModalOpen={
                                      handleConfirmAppointmentModalOpen
                                  }
                                  handleDeleteAppointmentModalOpen={
                                      handleDeleteAppointmentModalOpen
                                  }
                                  handleEditAppointmentModalOpen={
                                      handleEditAppointmentModalOpen
                                  }
                                  key={i}
                              />
                          ))
                        : null}
                    <Card sx={{ p: 2 }}>
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
                                      event={event}
                                      handleConfirmAppointmentModalOpen={
                                          handleConfirmAppointmentModalOpen
                                      }
                                      handleDeleteAppointmentModalOpen={
                                          handleDeleteAppointmentModalOpen
                                      }
                                      handleEditAppointmentModalOpen={
                                          handleEditAppointmentModalOpen
                                      }
                                      key={i}
                                  />
                              ))
                            : t('No upcoming event', { ns: 'common' })}
                    </Card>
                    <Card>
                        <Typography sx={{ p: 2 }} variant="h6">
                            {t('Past', { ns: 'common' })}
                        </Typography>
                        {_.reverse(
                            _.sortBy(
                                events?.filter(
                                    (event) => !isInTheFuture(event.end)
                                ),
                                ['start']
                            )
                        ).map((event, i) => (
                            <EventConfirmationCard
                                disabled={true}
                                event={event}
                                handleConfirmAppointmentModalOpen={
                                    handleConfirmAppointmentModalOpen
                                }
                                handleDeleteAppointmentModalOpen={
                                    handleDeleteAppointmentModalOpen
                                }
                                handleEditAppointmentModalOpen={
                                    handleEditAppointmentModalOpen
                                }
                                key={i}
                            />
                        ))}
                    </Card>
                    <Dialog
                        onClose={handleConfirmAppointmentModalClose}
                        open={isConfirmModalOpen}
                    >
                        <DialogContent>
                            You are aware of this meeting time and confirm.
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="primary"
                                disabled={
                                    event_id === '' ||
                                    event_temp?.description?.length === 0 ||
                                    BookButtonDisable
                                }
                                onClick={(e) =>
                                    handleConfirmAppointmentModal(
                                        e,
                                        event_id,
                                        event_temp
                                    )
                                }
                                startIcon={
                                    BookButtonDisable ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <CheckIcon />
                                    )
                                }
                                variant="contained"
                            >
                                {t('Yes', { ns: 'common' })}
                            </Button>
                            <Button
                                color="primary"
                                onClick={handleConfirmAppointmentModalClose}
                                variant="outlined"
                            >
                                {t('Close', { ns: 'common' })}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        onClose={handleDeleteAppointmentModalClose}
                        open={isDeleteModalOpen}
                    >
                        <DialogTitle>
                            {t('Warning', { ns: 'common' })}
                        </DialogTitle>
                        <DialogContent>
                            {t('Do you want to cancel this meeting?')}
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="primary"
                                disabled={event_id === '' || BookButtonDisable}
                                onClick={(e) =>
                                    handleDeleteAppointmentModal(e, event_id)
                                }
                                variant="contained"
                            >
                                {BookButtonDisable ? (
                                    <CircularProgress size={16} />
                                ) : (
                                    t('Delete', { ns: 'common' })
                                )}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ) : (
                <>
                    <Button
                        color="secondary"
                        onClick={switchCalendarAndMyBookedEvents}
                        size="sm"
                        variant="contained"
                    >
                        {t('All Appointments')}
                    </Button>
                    <Card>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                aria-label="basic tabs example"
                                indicatorColor="primary"
                                onChange={handleChangeTab}
                                scrollButtons="auto"
                                value={value}
                                variant="scrollable"
                            >
                                <Tab
                                    label={t('Calendar')}
                                    {...a11yProps(value, 0)}
                                />
                            </Tabs>
                        </Box>
                        <CustomTabPanel index={0} value={value}>
                            <MyCalendar
                                events={[...booked_events]}
                                handleChange={handleChange}
                                handleChangeReceiver={handleChangeReceiver}
                                handleModalBook={handleModalBook}
                                handleModalClose={handleModalClose}
                                handleModalCreateEvent={handleModalCreateEvent}
                                handleNewEventModalClose={
                                    handleNewEventModalClose
                                }
                                handleSelectEvent={handleSelectEvent}
                                handleSelectSlot={handleSelectSlot}
                                handleSelectStudent={handleSelectStudent}
                                handleUpdateTimeSlot={handleUpdateTimeSlotAgent}
                                isNewEventModalOpen={isNewEventModalOpen}
                                newDescription={newDescription}
                                newEventEnd={newEventEnd}
                                newEventStart={newEventStart}
                                newReceiver={newReceiver}
                                selectedEvent={selectedEvent}
                                student_id={student_id}
                                students={students}
                            />
                        </CustomTabPanel>
                    </Card>
                </>
            )}
            <Dialog
                onClose={handleEditAppointmentModalClose}
                open={isEditModalOpen}
            >
                <DialogTitle>{t('Edit', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                    請寫下想討論的主題
                    <TextField
                        fullWidth
                        inputProps={{ maxLength: 2000 }}
                        isInvalid={event_temp.description?.length > 2000}
                        minRows={10}
                        multiline
                        onChange={(e) => handleUpdateDescription(e)}
                        placeholder="Example：我想定案選校、選課，我想討論簽證，德語班。"
                        type="textarea"
                        value={event_temp.description || ''}
                    />
                    <Badge
                        bg={`${
                            event_temp.description?.length > 2000
                                ? 'danger'
                                : 'primary'
                        }`}
                    >
                        {event_temp.description?.length || 0}/{2000}
                    </Badge>
                    <Typography>
                        {t('Student', { ns: 'common' })}:{' '}
                        {event_temp?.requester_id?.map((requester, idx) => (
                            <Typography fontWeight="bold" key={idx}>
                                {requester.firstname} {requester.lastname}
                            </Typography>
                        ))}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        disabled={
                            event_id === '' ||
                            event_temp?.description?.length === 0 ||
                            BookButtonDisable
                        }
                        onClick={(e) =>
                            handleEditAppointmentModal(e, event_id, event_temp)
                        }
                        variant="contained"
                    >
                        {BookButtonDisable ? (
                            <CircularProgress size={16} />
                        ) : (
                            t('Update', { ns: 'common' })
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AllOfficeHours;
