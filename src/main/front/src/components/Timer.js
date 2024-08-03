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
    const [isRunning, setIsRunning] = useState(false); // 타이머 상태를 추적하기 위한 새로운 상태
    const [hasStarted, setHasStarted] = useState(false); // 타이머가 시작된 적이 있는지를 추적
    const timerIdRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!("Notification" in window)) {
            alert("이 브라우저는 데스크톱 알림을 지원하지 않습니다.");
        } else if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("알림 권한이 허용되었습니다.");
                    new Notification("알림 활성화", { body: "알림을 받을 수 있습니다!" });
                } else {
                    console.log("알림 권한이 거부되었습니다.");
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
        console.log("알림을 표시하려고 시도 중");
        if (Notification.permission === "granted") {
            const notification = new Notification("타이머 완료", {
                body: "눈 운동 및 스트레칭을 할 시간입니다!",
            });
            notification.onclick = function (event) {
                event.preventDefault();
                console.log("알림이 클릭되었고, /stretching으로 이동");
                navigate('/stretching');
            };
            console.log("알림이 표시됨");
        } else {
            console.log("알림 권한이 부여되지 않음");
            showStretchingButton();
        }
    }

    function startTimer() {
        if (!timerIdRef.current) {
            setIsRunning(true); // 타이머가 실행 중일 때 상태를 true로 설정
            setHasStarted(true); // 타이머가 시작됨을 표시
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
                        setIsRunning(false); // 타이머가 종료되면 상태를 false로 설정
                        return 0;
                    }
                });
            }, 1000);
        }
    }

    function stopTimer() {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
        setIsRunning(false); // 타이머가 멈추면 상태를 false로 설정
    }

    function resetTimer() {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
        setTime(0); // 시간을 0초로 설정
        setMessage('');
        setIsRunning(false); // 리셋 시 상태를 false로 설정
        setHasStarted(false); // 리셋 시 시작된 상태도 false로 설정
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
                        <button onClick={startTimer} className={isRunning ? 'active' : ''}>START</button>
                        <button onClick={stopTimer} className={!isRunning && hasStarted ? 'active' : ''}>STOP</button>
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
