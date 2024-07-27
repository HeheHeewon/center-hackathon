import React, { useState, useEffect, useRef } from 'react';

function WorkTimeTracker() {
    const [workTimes, setWorkTimes] = useState([]);
    const [currentWorkTime, setCurrentWorkTime] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [lastPauseTime, setLastPauseTime] = useState(null);
    const timeoutIdRef = useRef(null); // 타이머 ID를 저장할 ref

    useEffect(() => {
        fetchWorkTimes();
    }, []);

    useEffect(() => {
        if (currentWorkTime && !isPaused) {
            const start = new Date(currentWorkTime.startTime).getTime();

            const tick = () => {
                const now = new Date().getTime();
                const elapsedSinceStart = Math.floor((now - start) / 1000);
                const totalPaused = currentWorkTime.totalPauseDurationInSeconds;
                const newTimer = elapsedSinceStart - totalPaused;
                setTimer(newTimer >= 0 ? newTimer : 0);

                // 다음 tick 예약
                timeoutIdRef.current = setTimeout(tick, 1000);
            };

            tick(); // 타이머 시작

            return () => clearTimeout(timeoutIdRef.current); // 컴포넌트 언마운트 시 클린업
        } else {
            clearTimeout(timeoutIdRef.current); // 타이머 정지
        }
    }, [currentWorkTime, isPaused]);

    const fetchWorkTimes = () => {
        fetch('/api/worktime')
            .then(response => response.json())
            .then(data => {
                const convertedData = data.map(workTime => ({
                    ...workTime,
                    startTime: new Date(workTime.startTime),
                    endTime: workTime.endTime ? new Date(workTime.endTime) : null,
                    effectiveWorkDurationInSeconds: workTime.totalWorkDurationInSeconds - workTime.totalPauseDurationInSeconds
                }));
                setWorkTimes(convertedData);
            })
            .catch(error => console.error('Error fetching work times:', error));
    };

    const startWork = () => {
        fetch('/api/worktime/start', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                const startTime = new Date(data.startTime);
                const newWorkTime = {
                    id: data.id,
                    startTime: startTime,
                    endTime: null,
                    totalWorkDurationInSeconds: 0,
                    totalPauseDurationInSeconds: 0,
                    effectiveWorkDurationInSeconds: 0
                };
                setCurrentWorkTime(newWorkTime);
                setIsPaused(false);
                setTimer(0);
            })
            .catch(error => console.error('Error starting work:', error));
    };

    const endWork = () => {
        if (currentWorkTime) {
            fetch(`/api/worktime/end/${currentWorkTime.id}`, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    const updatedWorkTime = {
                        ...currentWorkTime,
                        endTime: new Date(data.endTime),
                        totalWorkDurationInSeconds: data.totalWorkDurationInSeconds,
                        totalPauseDurationInSeconds: data.totalPauseDurationInSeconds,
                        effectiveWorkDurationInSeconds: data.totalWorkDurationInSeconds - data.totalPauseDurationInSeconds
                    };
                    setWorkTimes(prev => [...prev, updatedWorkTime]);
                    setCurrentWorkTime(null);
                    setIsPaused(false);
                    setTimer(0);
                })
                .catch(error => console.error('Error ending work:', error));
        }
    };

    const pauseWork = () => {
        if (currentWorkTime && !isPaused) {
            fetch(`/api/worktime/pause/${currentWorkTime.id}`, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    setLastPauseTime(new Date(data.lastPauseTime));
                    setIsPaused(true);
                })
                .catch(error => console.error('Error pausing work:', error));
        }
    };

    const resumeWork = () => {
        if (currentWorkTime && isPaused) {
            fetch(`/api/worktime/resume/${currentWorkTime.id}`, { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    const now = new Date();
                    const pauseDuration = Math.floor((now - lastPauseTime) / 1000);
                    setLastPauseTime(null);
                    setIsPaused(false);
                    setCurrentWorkTime(prevWorkTime => {
                        const updatedWorkTime = {
                            ...prevWorkTime,
                            totalPauseDurationInSeconds: prevWorkTime.totalPauseDurationInSeconds + pauseDuration,
                            startTime: prevWorkTime.startTime
                        };
                        return updatedWorkTime;
                    });
                })
                .catch(error => console.error('Error resuming work:', error));
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return '0h 0m 0s';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const formatDateTime = (date) => {
        if (!date) return 'Ongoing';
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <h1>Work Time Tracker</h1>
            <button onClick={startWork} disabled={currentWorkTime && !isPaused}>Start Work</button>
            <button onClick={pauseWork} disabled={!currentWorkTime || isPaused}>Pause Work</button>
            <button onClick={resumeWork} disabled={!currentWorkTime || !isPaused}>Resume Work</button>
            <button onClick={endWork} disabled={!currentWorkTime}>End Work</button>
            {currentWorkTime && (
                <div>
                    <h2>Current Work Time: {formatTime(timer)}</h2>
                </div>
            )}
            <h2>Work Times</h2>
            <ul>
                {workTimes.map(workTime => (
                    <li key={workTime.id}>
                        Start: {formatDateTime(workTime.startTime)}<br />
                        End: {formatDateTime(workTime.endTime)}<br />
                        Total Work Duration: {formatTime(workTime.totalWorkDurationInSeconds)}<br />
                        Total Pause Duration: {formatTime(workTime.totalPauseDurationInSeconds)}<br />
                        Effective Work Duration: {formatTime(workTime.effectiveWorkDurationInSeconds)}<br />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default WorkTimeTracker;
