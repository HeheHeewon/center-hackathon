import React, { useState, useEffect, useCallback } from 'react';

function WorkTimeTracker() {
    const [workTimes, setWorkTimes] = useState([]);
    const [currentWorkTimeId, setCurrentWorkTimeId] = useState(null);
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

    // calculateTotalWorkDuration를 useCallback으로 정의
    const calculateTotalWorkDuration = useCallback((startTime, endTime) => {
        if (startTime) {
            const effectiveEndTime = endTime || new Date();
            const duration = (effectiveEndTime - startTime) / 1000; // seconds
            return duration;
        }
        return 0;
    }, []);

    // calculateEffectiveWorkDuration를 useCallback으로 정의
    const calculateEffectiveWorkDuration = useCallback((startTime, endTime, totalPauseDuration) => {
        const totalWorkDuration = calculateTotalWorkDuration(startTime, endTime);
        return totalWorkDuration - (totalPauseDuration || 0);
    }, [calculateTotalWorkDuration]); // calculateTotalWorkDuration 의존성 추가

    // fetchWorkTimes를 useCallback으로 정의
    const fetchWorkTimes = useCallback(() => {
        fetch('/api/worktime')
            .then(response => response.json())
            .then(data => {
                const convertedData = data.map(workTime => {
                    const startTime = new Date(workTime.startTime);
                    const endTime = workTime.endTime ? new Date(workTime.endTime) : null;
                    const totalWorkDuration = calculateTotalWorkDuration(startTime, endTime);
                    const effectiveWorkDuration = calculateEffectiveWorkDuration(startTime, endTime, workTime.totalPauseDurationInSeconds);

                    return {
                        ...workTime,
                        startTime,
                        endTime,
                        totalWorkDurationInSeconds: totalWorkDuration,
                        effectiveWorkDurationInSeconds: effectiveWorkDuration,
                        totalPauseDurationInSeconds: workTime.totalPauseDurationInSeconds
                    };
                });
                setWorkTimes(convertedData);
            })
            .catch(error => console.error('Error fetching work times:', error));
    }, [calculateTotalWorkDuration, calculateEffectiveWorkDuration]); // 의존성 배열에 calculateTotalWorkDuration, calculateEffectiveWorkDuration 추가

    useEffect(() => {
        fetchWorkTimes();
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [fetchWorkTimes, intervalId]); // 의존성 배열에 fetchWorkTimes 추가

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
                setIsPaused(false);
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
                    setIsPaused(false);
                    setTimer(0);
                    fetchWorkTimes();
                })
                .catch(error => console.error('Error ending work:', error));
        }
    };

    const pauseWork = () => {
        if (currentWorkTimeId && !isPaused) {
            clearInterval(intervalId);
            fetch(`/api/worktime/pause/${currentWorkTimeId}`, { method: 'POST' })
                .then(response => response.json())
                .then(() => {
                    setIsPaused(true);
                })
                .catch(error => console.error('Error pausing work:', error));
        }
    };

    const resumeWork = () => {
        if (currentWorkTimeId && isPaused) {
            fetch(`/api/worktime/resume/${currentWorkTimeId}`, { method: 'POST' })
                .then(response => response.json())
                .then(() => {
                    setIsPaused(false);
                    const id = setInterval(() => {
                        setTimer(prevTimer => prevTimer + 1);
                    }, 1000);
                    setIntervalId(id);
                })
                .catch(error => console.error('Error resuming work:', error));
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = (seconds % 60).toFixed(2);
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div>
            <h1>Work Time Tracker</h1>
            <button onClick={startWork} disabled={currentWorkTimeId && !isPaused}>Start Work</button>
            <button onClick={pauseWork} disabled={!currentWorkTimeId || isPaused}>Pause Work</button>
            <button onClick={resumeWork} disabled={!currentWorkTimeId || !isPaused}>Resume Work</button>
            <button onClick={endWork} disabled={!currentWorkTimeId}>End Work</button>
            {currentWorkTimeId && (
                <div>
                    <h2>Current Work Time: {formatTime(timer)}</h2>
                </div>
            )}
            <h2>Work Times</h2>
            <ul>
                {workTimes.map(workTime => (
                    <li key={workTime.id}>
                        Start: {workTime.startTime.toLocaleString("en-US", { timeZone: "Asia/Seoul", hour12: true })}<br />
                        End: {workTime.endTime ? workTime.endTime.toLocaleString("en-US", { timeZone: "Asia/Seoul", hour12: true }) : 'Ongoing'}<br />
                        Total Work Duration: {formatTime(workTime.totalWorkDurationInSeconds)}<br />
                        Effective Work Duration: {formatTime(workTime.effectiveWorkDurationInSeconds)}<br />
                        Total Pause Duration: {formatTime(workTime.totalPauseDurationInSeconds)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WorkTimeTracker;
