import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function WorkCalendar({ onDateChange, workedDays }) {

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && workedDays.find(d => d.toDateString() === date.toDateString())) {
            return 'worked-day';
        }
        return null;
    };

    return (
        <div>
            <Calendar
                onChange={onDateChange}
                tileClassName={tileClassName}
            />
        </div>
    );
}

export default WorkCalendar;
