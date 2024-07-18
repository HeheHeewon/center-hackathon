import React, { useState, useEffect } from 'react';

function WorkTimeTracker() {
    const [workTimes, setWorkTimes] = useState([]);
    const [currentWorkTimeId, setCurrentWorkTimeId] = useState(null);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        fetchWorkTimes();
    }, []);

    const fetchWorkTimes = () => {
        fetch('/api/worktime')
            .then(response => response.json())
            .then(data => setWorkTimes(data))
            .catch(error => console.error('Error fetching work times:', error));
    };

    const startWork = () => {
        fetch('/api/worktime/start', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                setCurrentWorkTimeId(data.id);
                setTimer(0);
                const id = setInterval(() => {
                    setTimer(prevTimer => prevTimer + 1);
                }, 1000);
                setIntervalId(id);
            })
            .catch(error => console.error('Error starting work:', error));
    };

    const endWork = () => {
        if (currentWorkTimeId) {
            clearInterval(intervalId);
            fetch(`/api/worktime/end/${currentWorkTimeId}`, { method: 'POST' })
                .then(response => response.json())
                .then(() => {
                    setCurrentWorkTimeId(null);
                    fetchWorkTimes();
                })
                .catch(error => console.error('Error ending work:', error));
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div>
            <h1>Work Time Tracker</h1>
            <button onClick={startWork}>Start Work</button>
            <button onClick={endWork}>End Work</button>
            {currentWorkTimeId && (
                <div>
                    <h2>Current Work Time: {formatTime(timer)}</h2>
                </div>
            )}
            <h2>Work Times</h2>
            <ul>
                {workTimes.map(workTime => (
                    <li key={workTime.id}>
                        Start: {new Date(workTime.startTime).toLocaleString()}<br />
                        End: {workTime.endTime ? new Date(workTime.endTime).toLocaleString() : 'Ongoing'}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WorkTimeTracker;
