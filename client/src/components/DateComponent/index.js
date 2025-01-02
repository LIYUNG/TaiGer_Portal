import React, { useEffect, useState } from 'react';
import './index.css'; // Import a separate CSS file for styling

const EventDateComponent = ({ eventDate }) => {
    const [formattedDate, setFormattedDate] = useState({
        month: '',
        day: '',
        weekDay: ''
    });

    useEffect(() => {
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const month = months[eventDate.getMonth()];
        const day = eventDate.getDate().toString().padStart(2, '0');
        const weekDay = daysOfWeek[eventDate.getDay()];

        setFormattedDate({ month, day, weekDay });
    }, [eventDate]);

    return (
        <div className="event-date">
            <div className="month">{formattedDate.month}</div>
            <div className="day">{formattedDate.day}</div>
            <div className="week-day">{formattedDate.weekDay}</div>
        </div>
    );
};

export default EventDateComponent;
