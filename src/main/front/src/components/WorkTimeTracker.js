import './WorkTimeTracker.css';
import FlipClock from './FlipClock';
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
        if (isNaN(seconds) || seconds < 0) return { hours: 0, minutes: 0, seconds: 0 };
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return { hours: h, minutes: m, seconds: s };
    };

    const formatDateTime = (date) => {
        if (!date) return 'Ongoing';
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    const formattedTime = formatTime(timer);

    return (
        <div className="work-time-tracker">
            <div className="Wrapper">
            <div>
                <FlipClock hours={formattedTime.hours} minutes={formattedTime.minutes} seconds={formattedTime.seconds} />
            </div>

            <div className = "button-group">
                <button onClick={startWork} disabled={currentWorkTime && !isPaused}>START</button>
                <button onClick={pauseWork} disabled={!currentWorkTime || isPaused}>PAUSE</button>
                <button onClick={resumeWork} disabled={!currentWorkTime || !isPaused}>RESUME</button>
                <button onClick={endWork} disabled={!currentWorkTime}>STOP</button>
            </div>
            </div>

        </div>
    );
}

export default WorkTimeTracker;
