import React from 'react';
import './WorkTimeTracker.css';

const FlipUnit = ({ digit }) => (
    <div className="flip-unit">
        <div className="flip-number">{digit}</div>
    </div>
);

const FlipClock = ({ hours, minutes, seconds }) => {
    const formatNumber = (num) => num.toString().padStart(2, '0').split('');

    const [hoursTens, hoursUnits] = formatNumber(hours);
    const [minutesTens, minutesUnits] = formatNumber(minutes);
    const [secondsTens, secondsUnits] = formatNumber(seconds);

    return (
        <div className="flip-clock">
            <FlipUnit digit={hoursTens} />
            <FlipUnit digit={hoursUnits} />
            <span className="flip-colon">:</span>
            <FlipUnit digit={minutesTens} />
            <FlipUnit digit={minutesUnits} />
            <span className="flip-colon">:</span>
            <FlipUnit digit={secondsTens} />
            <FlipUnit digit={secondsUnits} />
        </div>
    );
};

export default FlipClock;
