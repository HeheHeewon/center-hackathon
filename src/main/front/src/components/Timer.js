import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FlipClock from './FlipClock';
import Popup from './Popup';
import './Timer.css';
import NavBar from './NavBar_black';

function Timer() {
    const [time, setTime] = useState(0);
    const [message, setMessage] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const timerIdRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications.");
        } else if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("Notification permission granted.");
                    new Notification("Notification enabled", { body: "You will receive alerts!" });
                } else {
                    console.log("Notification permission denied.");
                    setNotificationMessage("알림 권한 설정을 거부했습니다. 다시 설정하기 위해 브라우저 설정으로 이동해야 합니다.");
                }
            });
        }
    }, []);

    function formatTime(seconds) {
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = seconds % 60;
        return { hours: h, minutes: m, seconds: s };
    }

    function handleTimeChange(event) {
        setTime(parseInt(event.target.value, 10));
        setIsExpanded(false);
    }

    function showStretchingButton() {
        setNotificationMessage(
            <button onClick={() => navigate('/stretching')}>
                스트레칭 페이지로 이동
            </button>
        );
    }

    function showNotification() {
        console.log("Attempting to show notification");
        if (Notification.permission === "granted") {
            const notification = new Notification("Timer Completed", {
                body: "Time to do some eye exercises and stretching!",
            });
            notification.onclick = function (event) {
                event.preventDefault();
                console.log("Notification clicked, redirecting to /stretching");
                navigate('/stretching');
            };
            console.log("Notification shown");
        } else {
            console.log("Notification permission not granted");
            showStretchingButton();
        }
    }

    function startTimer() {
        if (!timerIdRef.current) {
            timerIdRef.current = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime > 0) {
                        return prevTime - 1;
                    } else {
                        clearInterval(timerIdRef.current);
                        timerIdRef.current = null;
                        setMessage("Time's up!");
                        setShowPopup(true); // 팝업 표시
                        showNotification();
                        return 0;
                    }
                });
            }, 1000);
        }
    }

    function stopTimer() {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
    }

    function resetTimer() {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
        setTime(0); // 시간을 0초로 설정
        setMessage('');
    }

    const formattedTime = formatTime(time);

    return (
        <div className="app-container">
            <NavBar />
            <div className="section1">
                <div className="timer-container">
                    <div className="flip-clock-wrapper">
                        <FlipClock hours={formattedTime.hours} minutes={formattedTime.minutes} seconds={formattedTime.seconds} />
                    </div>

                    <div className="button-group">
                        <form className="timer-form" action="/timer" method="get">
                            <select
                                className={`timer-select ${isExpanded ? 'expanded' : ''}`}
                                name="time"
                                onChange={handleTimeChange}
                                onClick={() => setIsExpanded(!isExpanded)}
                                defaultValue=""
                            >
                                <option value="" disabled>STRETCH ALARM</option>
                                <option value="3">3 seconds</option>
                                <option value="900">15 minutes</option>
                                <option value="1800">30 minutes</option>
                                <option value="2700">45 minutes</option>
                                <option value="3600">1 hour</option>
                            </select>
                            <div className="select-arrow"></div>
                        </form>
                        <button onClick={startTimer}>START</button>
                        <button onClick={stopTimer}>STOP</button>
                        <button onClick={resetTimer}>RESET</button>
                    </div>
                    {showPopup && (
                        <Popup 
                            onClose={() => setShowPopup(false)}
                            onConfirm={() => { setShowPopup(false); navigate('/stretching'); }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Timer;
