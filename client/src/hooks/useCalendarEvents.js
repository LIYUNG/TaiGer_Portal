import { useEffect, useState } from 'react';
import {
    confirmEvent,
    deleteEvent,
    getAllEvents,
    getEvents,
    postEvent,
    updateEvent
} from '../api';
import { is_TaiGer_Agent, is_TaiGer_Student } from '@taiger-common/core';
import { useAuth } from '../components/AuthProvider';
import { getUTCWithDST, time_slots } from '../utils/contants';

function useCalendarEvents(props) {
    const { user } = useAuth();
    const [calendarEventsState, setCalendarEventsState] = useState({
        error: '',
        isLoaded: false,
        data: null,
        success: false,
        agents: {},
        student_id: '',
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
        newEventStart: null,
        newEventEnd: null,
        isNewEventModalOpen: false,
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });

    useEffect(() => {
        setCalendarEventsState((prevState) => ({
            ...prevState,
            isLoaded: false
        }));
        if (props.isAll) {
            getAllEvents().then(
                (resp) => {
                    const { data, agents, hasEvents, students, success } =
                        resp.data;
                    const { status } = resp;
                    if (success) {
                        setCalendarEventsState((prevState) => ({
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
                        setCalendarEventsState((prevState) => ({
                            ...prevState,
                            isLoaded: true,
                            res_status: status
                        }));
                    }
                },
                (error) => {
                    setCalendarEventsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        error,
                        res_status: 500
                    }));
                }
            );
        } else {
            getEvents({
                startTime: props.startTime,
                endTime: props.endTime
            }).then(
                (resp) => {
                    const {
                        data,
                        agents,
                        booked_events,
                        students,
                        hasEvents,
                        success
                    } = resp.data;
                    const { status } = resp;
                    if (success) {
                        setCalendarEventsState((prevState) => ({
                            ...prevState,
                            isLoaded: true,
                            agents,
                            hasEvents,
                            students,
                            events: data,
                            booked_events,
                            success: success,
                            res_status: status
                        }));
                    } else {
                        setCalendarEventsState((prevState) => ({
                            ...prevState,
                            isLoaded: true,
                            res_status: status
                        }));
                    }
                },
                (error) => {
                    setCalendarEventsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        error,
                        res_status: 500
                    }));
                }
            );
        }
    }, [props.user_id, props.startTime, props.endTime, props.isAll]);

    // Only Agent can request
    const handleModalCreateEvent = (newEvent) => {
        const eventWrapper = { ...newEvent };
        if (is_TaiGer_Agent(user)) {
            const temp_std = calendarEventsState.students.find(
                (std) => std._id.toString() === calendarEventsState.student_id
            );
            eventWrapper.title = `${temp_std.firstname} ${temp_std.lastname} ${temp_std.firstname_chinese} ${temp_std.lastname_chinese}`;
            eventWrapper.requester_id = calendarEventsState.student_id;
            eventWrapper.receiver_id = user._id.toString();
        }
        // e.preventDefault();
        setCalendarEventsState((prevState) => ({
            ...prevState,
            BookButtonDisable: true
        }));
        postEvent(eventWrapper).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                const events_temp = [...calendarEventsState.events];
                events_temp.push(data);
                if (success) {
                    setCalendarEventsState((prevState) => ({
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
                    setCalendarEventsState((prevState) => ({
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
                setCalendarEventsState((prevState) => ({
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

    const handleModalBook = (e) => {
        e.preventDefault();
        setCalendarEventsState((prevState) => ({
            ...prevState,
            BookButtonDisable: true
        }));
        const eventWrapper = { ...calendarEventsState.selectedEvent };
        if (is_TaiGer_Student(user)) {
            eventWrapper.requester_id = user._id.toString();
            eventWrapper.description = calendarEventsState.newDescription;
            eventWrapper.receiver_id = calendarEventsState.newReceiver;
        }
        postEvent(eventWrapper).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                const events_temp = [...calendarEventsState.events];
                events_temp.push(data);
                if (success) {
                    setCalendarEventsState((prevState) => ({
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
                    setCalendarEventsState((prevState) => ({
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
                setCalendarEventsState((prevState) => ({
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

    const handleConfirmAppointmentModal = (e, event_id, updated_event) => {
        e.preventDefault();
        setCalendarEventsState((prevState) => ({
            ...prevState,
            BookButtonDisable: true
        }));
        confirmEvent(event_id, updated_event).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                const temp_events = [...calendarEventsState.events];
                let found_event_idx = temp_events.findIndex(
                    (temp_event) => temp_event._id.toString() === event_id
                );
                if (found_event_idx >= 0) {
                    temp_events[found_event_idx] = data;
                }
                if (success) {
                    setCalendarEventsState((prevState) => ({
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
                    setCalendarEventsState((prevState) => ({
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
                setCalendarEventsState((prevState) => ({
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
        setCalendarEventsState((prevState) => ({
            ...prevState,
            BookButtonDisable: true
        }));
        updateEvent(event_id, updated_event).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                const temp_events = [...calendarEventsState.events];
                let found_event_idx = temp_events.findIndex(
                    (temp_event) => temp_event._id.toString() === event_id
                );
                if (found_event_idx >= 0) {
                    temp_events[found_event_idx] = data;
                }
                if (success) {
                    setCalendarEventsState((prevState) => ({
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
                    setCalendarEventsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        BookButtonDisable: false,
                        event_id: '',
                        res_status: status
                    }));
                }
            },
            (error) => {
                setCalendarEventsState((prevState) => ({
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
        setCalendarEventsState((prevState) => ({
            ...prevState,
            BookButtonDisable: true
        }));
        deleteEvent(event_id).then(
            (resp) => {
                const { data, agents, hasEvents, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setCalendarEventsState((prevState) => ({
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
                    setCalendarEventsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        event_id: '',
                        BookButtonDisable: false,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setCalendarEventsState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    BookButtonDisable: false,
                    error,
                    res_status: 500
                }));
            }
        );
    };

    const handleConfirmAppointmentModalOpen = (e, event) => {
        e.preventDefault();
        e.stopPropagation();
        setCalendarEventsState((prevState) => ({
            ...prevState,
            isConfirmModalOpen: true,
            event_temp: event,
            event_id: event._id.toString()
        }));
    };

    const handleEditAppointmentModalOpen = (e, event) => {
        e.preventDefault();
        e.stopPropagation();
        setCalendarEventsState((prevState) => ({
            ...prevState,
            isEditModalOpen: true,
            event_temp: event,
            event_id: event._id.toString()
        }));
    };

    const handleUpdateDescription = (e) => {
        const new_description_temp = e.target.value;
        setCalendarEventsState((prevState) => ({
            ...prevState,
            event_temp: {
                ...prevState.event_temp,
                description: new_description_temp
            }
        }));
    };

    const handleUpdateTimeSlot = (e) => {
        const new_timeslot_temp = e.target.value;
        setCalendarEventsState((prevState) => ({
            ...prevState,
            event_temp: { ...prevState.event_temp, start: new_timeslot_temp }
        }));
    };

    const handleUpdateTimeSlotAgent = (e) => {
        const new_timeslot_temp = e.target.value;
        setCalendarEventsState((prevState) => ({
            ...prevState,
            event_temp: {
                ...prevState.event_temp,
                start: new_timeslot_temp
            },
            newEventStart: new_timeslot_temp
        }));
    };

    const handleConfirmAppointmentModalClose = () => {
        setCalendarEventsState((prevState) => ({
            ...prevState,
            isConfirmModalOpen: false
        }));
    };

    const handleEditAppointmentModalClose = () => {
        setCalendarEventsState((prevState) => ({
            ...prevState,
            isEditModalOpen: false
        }));
    };

    const handleDeleteAppointmentModalClose = () => {
        setCalendarEventsState((prevState) => ({
            ...prevState,
            isDeleteModalOpen: false
        }));
    };

    const handleDeleteAppointmentModalOpen = (e, event) => {
        e.preventDefault();
        e.stopPropagation();
        setCalendarEventsState((prevState) => ({
            ...prevState,
            isDeleteModalOpen: true,
            event_id: event._id.toString()
        }));
    };

    const handleModalClose = () => {
        setCalendarEventsState((prevState) => ({
            ...prevState,
            selectedEvent: {},
            newDescription: '',
            newReceiver: ''
        }));
    };

    const handleChangeReceiver = (e) => {
        const receiver_temp = e.target.value;
        setCalendarEventsState((prevState) => ({
            ...prevState,
            newReceiver: receiver_temp
        }));
    };

    // Calendar handler:
    const handleSelectEvent = (event) => {
        setCalendarEventsState((prevState) => ({
            ...prevState,
            selectedEvent: event
        }));
    };
    const handleChange = (e) => {
        const description_temp = e.target.value;
        setCalendarEventsState((prevState) => ({
            ...prevState,
            newDescription: description_temp
        }));
    };

    const handleSelectSlot = (slotInfo) => {
        // When an empty date slot is clicked, open the modal to create a new event
        setCalendarEventsState((prevState) => ({
            ...prevState,
            newEventStart: slotInfo.start,
            newEventEnd: slotInfo.end,
            isNewEventModalOpen: true
        }));
    };

    const handleSelectSlotAgent = (slotInfo) => {
        // When an empty date slot is clicked, open the modal to create a new event
        const Some_Date = new Date(slotInfo.start); //bug
        const year = Some_Date.getFullYear();
        const month = Some_Date.getMonth() + 1;
        const day = Some_Date.getDate();

        setCalendarEventsState((prevState) => ({
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
        setCalendarEventsState((prevState) => ({
            ...prevState,
            isNewEventModalOpen: false,
            newDescription: ''
        }));
    };

    const switchCalendarAndMyBookedEvents = () => {
        setCalendarEventsState((prevState) => ({
            ...prevState,
            hasEvents: !prevState.hasEvents
        }));
    };

    const ConfirmError = () => {
        setCalendarEventsState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const handleSelectStudent = (e) => {
        const student_id = e.target.value;
        setCalendarEventsState((prevState) => ({
            ...prevState,
            student_id: student_id
        }));
    };

    let available_termins_full = [];
    function getAvailableTermins({
        selected_day,
        selected_month,
        selected_year
    }) {
        return time_slots.flatMap((time_slot, j) => {
            const year = selected_year;
            const month = selected_month;
            const day = selected_day;

            const test_date = getUTCWithDST(
                year,
                month,
                day,
                user.timezone,
                time_slot.value
            );
            const start_date = new Date(test_date);
            const end_date = new Date(start_date);
            end_date.setMinutes(end_date.getMinutes() + 30);
            return {
                id: j * 10,
                title: `${start_date.getHours()}:${time_slot.value.split(':')[1]}`,
                start: start_date,
                end: end_date
                // provider: agent
            };
        });
    }
    if (is_TaiGer_Agent(user) && calendarEventsState.selected_year) {
        available_termins_full = getAvailableTermins({
            selected_day: calendarEventsState.selected_day,
            selected_month: calendarEventsState.selected_month,
            selected_year: calendarEventsState.selected_year
        });
    }

    return {
        events: calendarEventsState.events,
        agents: calendarEventsState.agents,
        hasEvents: calendarEventsState.hasEvents,
        booked_events: calendarEventsState.booked_events,
        isLoaded: calendarEventsState.isLoaded,
        res_status: calendarEventsState.res_status,
        isConfirmModalOpen: calendarEventsState.isConfirmModalOpen,
        event_id: calendarEventsState.event_id,
        event_temp: calendarEventsState.event_temp,
        BookButtonDisable: calendarEventsState.BookButtonDisable,
        isEditModalOpen: calendarEventsState.isEditModalOpen,
        newReceiver: calendarEventsState.newReceiver,
        newDescription: calendarEventsState.newDescription,
        selectedEvent: calendarEventsState.selectedEvent,
        newEventStart: calendarEventsState.newEventStart,
        newEventEnd: calendarEventsState.newEventEnd,
        isNewEventModalOpen: calendarEventsState.isNewEventModalOpen,
        isDeleteModalOpen: calendarEventsState.isDeleteModalOpen,
        students: calendarEventsState.students,
        student_id: calendarEventsState.student_id,
        available_termins_full: available_termins_full,
        handleConfirmAppointmentModalOpen: handleConfirmAppointmentModalOpen,
        handleEditAppointmentModalOpen: handleEditAppointmentModalOpen,
        handleModalBook: handleModalBook,
        handleUpdateDescription: handleUpdateDescription,
        handleEditAppointmentModal: handleEditAppointmentModal,
        handleConfirmAppointmentModal: handleConfirmAppointmentModal,
        handleDeleteAppointmentModal: handleDeleteAppointmentModal,
        handleUpdateTimeSlot: handleUpdateTimeSlot,
        handleUpdateTimeSlotAgent: handleUpdateTimeSlotAgent,
        handleConfirmAppointmentModalClose: handleConfirmAppointmentModalClose,
        handleEditAppointmentModalClose: handleEditAppointmentModalClose,
        handleDeleteAppointmentModalClose: handleDeleteAppointmentModalClose,
        handleDeleteAppointmentModalOpen: handleDeleteAppointmentModalOpen,
        handleModalClose: handleModalClose,
        handleChangeReceiver: handleChangeReceiver,
        handleSelectEvent: handleSelectEvent,
        handleChange: handleChange,
        handleSelectSlot: handleSelectSlot,
        handleSelectSlotAgent: handleSelectSlotAgent,
        handleNewEventModalClose: handleNewEventModalClose,
        switchCalendarAndMyBookedEvents: switchCalendarAndMyBookedEvents,
        handleModalCreateEvent: handleModalCreateEvent,
        handleSelectStudent: handleSelectStudent,
        res_modal_message: calendarEventsState.res_modal_message,
        res_modal_status: calendarEventsState.res_modal_status,
        ConfirmError
    };
}

export default useCalendarEvents;
