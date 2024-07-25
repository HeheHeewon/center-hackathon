import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import Chart from 'chart.js/auto';
import { registerables } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

Chart.register(...registerables);

function WorkTimeChart() {
    const [workHours, setWorkHours] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [workedDays, setWorkedDays] = useState([]);
    const [totalWorkDuration, setTotalWorkDuration] = useState(0); // 총 근무 시간 상태 추가
    const [weeklyWorkHours, setWeeklyWorkHours] = useState({});
    const [currentWorkTimeId, setCurrentWorkTimeId] = useState(null); // 현재 작업 ID 상태 추가

    useEffect(() => {
        const today = new Date();
        fetchWorkedDays(today.getFullYear(), today.getMonth() + 1);
    }, []);

    useEffect(() => {
        fetchDailyWorkHours(selectedDate);
        fetchWeeklyWorkHours(selectedDate); // 주간 데이터도 가져오기
    }, [selectedDate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchDailyWorkHours(selectedDate);
            fetchWeeklyWorkHours(selectedDate); // 주간 데이터도 주기적으로 가져오기
        }, 60000); // 1분마다 서버로부터 작업 상태를 확인

        return () => clearInterval(intervalId);
    }, [selectedDate]);

    const fetchWorkedDays = (year, month) => {
        fetch(`/api/worktime/workedDays?year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                console.log('Worked days data:', data);
                setWorkedDays(data.map(date => new Date(date)));
            })
            .catch(error => console.error('Error fetching worked days:', error));
    };

    const fetchDailyWorkHours = (date) => {
        const dateString = date.toISOString().split('T')[0];
        console.log(`Fetching data for: ${dateString}`);
        fetch(`/api/worktime/daily?date=${dateString}`)
            .then(response => response.json())
            .then(data => {
                console.log("Received data for", dateString, data);
                const minutesData = Object.keys(data).reduce((acc, hour) => {
                    acc[hour] = (data[hour] / 60).toFixed(2);
                    return acc;
                }, {});
                setWorkHours(minutesData);
                console.log('Processed work hours:', minutesData);

                // 총 근무 시간을 계산하여 상태 업데이트
                const totalMinutes = Object.values(minutesData).reduce((acc, curr) => acc + parseFloat(curr), 0);
                setTotalWorkDuration(totalMinutes);
            })
            .catch(error => console.error('Error fetching daily work hours:', error));
    };

    const fetchWeeklyWorkHours = (date) => {
        const startDate = new Date(date);
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // 월요일로 시작
        const startDateString = startDate.toISOString().split('T')[0];
        fetch(`/api/worktime/weekly?startDate=${startDateString}`)
            .then(response => response.json())
            .then(data => {
                console.log("Received weekly data for", startDateString, data);
                const hoursData = Object.keys(data).reduce((acc, day) => {
                    acc[day] = (data[day] / 60).toFixed(2); // 초를 분으로 변환
                    return acc;
                }, {});
                setWeeklyWorkHours(hoursData);
                console.log('Processed weekly work hours:', hoursData);
            })
            .catch(error => console.error('Error fetching weekly work hours:', error));
    };

    const handleDateChange = (date) => {
        const kstDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000) + 9 * 60 * 60 * 1000); // KST 적용
        console.log(`Date selected: ${kstDate}`);
        setSelectedDate(kstDate);
    };

    const handleEndWork = (id) => {
        fetch(`/api/worktime/end/${id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                console.log('Ended work time:', data);
                setCurrentWorkTimeId(null);
                fetchDailyWorkHours(selectedDate); // 종료 후 데이터 갱신
            })
            .catch(error => console.error('Error ending work:', error));
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && workedDays.find(d => d.toDateString() === date.toDateString())) {
            return 'worked-day';
        }
        return null;
    };

    const dailyData = {
        labels: Object.keys(workHours).map(hour => `${hour}:00`),
        datasets: [
            {
                label: 'Work Duration (in minutes)',
                data: Object.values(workHours).map(minutes => parseFloat(minutes)),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const weeklyData = {
        labels: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
        datasets: [
            {
                label: 'Work Duration (in minutes)',
                data: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => parseFloat(weeklyWorkHours[day] || 0)),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const dailyOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 60,
                title: {
                    display: true,
                    text: 'Work Duration (minutes)',
                },
                ticks: {
                    stepSize: 5,
                    callback: function (value) {
                        return `${value}m`;
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Time of Day',
                },
                ticks: {
                    stepSize: 1,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const minutes = Math.floor(value);
                        const seconds = Math.round((value - minutes) * 60);
                        return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
                    },
                },
            },
        },
    };

    const weeklyOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 600, // 600 minutes = 10 hours
                title: {
                    display: true,
                    text: 'Work Duration (minutes)',
                },
                ticks: {
                    stepSize: 60, // 1 hour = 60 minutes
                    callback: function (value) {
                        return `${value}m`;
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Day of Week',
                },
                ticks: {
                    stepSize: 1,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const minutes = Math.floor(value);
                        const hours = Math.floor(minutes / 60);
                        const remainingMinutes = minutes % 60;
                        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
                    },
                },
            },
        },
    };

    console.log('Chart data:', dailyData, weeklyData);

    return (
        <div>
            <h2>Work Duration Chart</h2>
            <Calendar
                onChange={handleDateChange}
                tileClassName={tileClassName}
            />
            <Bar data={dailyData} options={dailyOptions} />
            <h3>Total Work Duration: {Math.floor(totalWorkDuration / 60)}h {Math.floor(totalWorkDuration % 60)}m</h3>
            {currentWorkTimeId && (
                <button onClick={() => handleEndWork(currentWorkTimeId)}>End Current Work</button>
            )}
            <h2>Weekly Work Duration Chart</h2>
            <Bar data={weeklyData} options={weeklyOptions} />
        </div>
    );
}

export default WorkTimeChart;
