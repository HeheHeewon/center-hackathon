import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import Chart from 'chart.js/auto';
import { registerables } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './WorkTimeChart.css';

import good from './doinggood.svg';

Chart.register(...registerables);

function WorkTimeChart() {
    const [activeTab, setActiveTab] = useState('daily');
    const [workHours, setWorkHours] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [workedDays, setWorkedDays] = useState([]);
    const [totalWorkDuration, setTotalWorkDuration] = useState(0);
    const [weeklyWorkHours, setWeeklyWorkHours] = useState({});
    const [monthlyWorkHours, setMonthlyWorkHours] = useState({});
    const [currentWorkTimeId, setCurrentWorkTimeId] = useState(null);

    useEffect(() => {
        const today = new Date();
        fetchWorkedDays(today.getFullYear(), today.getMonth() + 1);
        fetchMonthlyWorkHours(today.getFullYear());
    }, []);

    useEffect(() => {
        fetchDailyWorkHours(selectedDate);
        fetchWeeklyWorkHours(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchDailyWorkHours(selectedDate);
            fetchWeeklyWorkHours(selectedDate);
        }, 60000);

        return () => clearInterval(intervalId);
    }, [selectedDate]);

    const selectedYear = selectedDate.getFullYear();

    useEffect(() => {
        fetchMonthlyWorkHours(selectedYear);
    }, [selectedYear]);

    const fetchWorkedDays = (year, month) => {
        fetch(`/api/worktime/workedDays?year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                setWorkedDays(data.map(date => new Date(date)));
            })
            .catch(error => console.error('Error fetching worked days:', error));
    };

    const fetchDailyWorkHours = (date) => {
        const dateString = date.toISOString().split('T')[0];
        fetch(`/api/worktime/daily?date=${dateString}`)
            .then(response => response.json())
            .then(data => {
                const minutesData = Object.keys(data).reduce((acc, hour) => {
                    acc[hour] = (data[hour] / 60).toFixed(3);
                    return acc;
                }, {});
                setWorkHours(minutesData);

                const totalMinutes = Object.values(minutesData).reduce((acc, curr) => acc + parseFloat(curr), 0);
                setTotalWorkDuration(totalMinutes);
            })
            .catch(error => console.error('Error fetching daily work hours:', error));
    };

    const fetchWeeklyWorkHours = (date) => {
        const startDate = new Date(date);
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
        const startDateString = startDate.toISOString().split('T')[0];
        console.log("Requesting weekly work hours starting from:", startDateString);

        fetch(`/api/worktime/weekly?startDate=${startDateString}`)
            .then(response => response.json())
            .then(data => {
                const hoursData = Object.keys(data).reduce((acc, day) => {
                    acc[day] = (data[day] / 3600).toFixed(3);
                    return acc;
                }, {});
                setWeeklyWorkHours(hoursData);
            })
            .catch(error => console.error('Error fetching weekly work hours:', error));
    };

    const fetchMonthlyWorkHours = (year) => {
        fetch(`/api/worktime/monthly?year=${year}`)
            .then(response => response.json())
            .then(data => {
                const monthMap = {
                    "JANUARY": "JAN",
                    "FEBRUARY": "FEB",
                    "MARCH": "MAR",
                    "APRIL": "APR",
                    "MAY": "MAY",
                    "JUNE": "JUN",
                    "JULY": "JUL",
                    "AUGUST": "AUG",
                    "SEPTEMBER": "SEP",
                    "OCTOBER": "OCT",
                    "NOVEMBER": "NOV",
                    "DECEMBER": "DEC"
                };

                const hoursData = Object.keys(data).reduce((acc, key) => {
                    const monthLabel = monthMap[key];
                    if (monthLabel) {
                        acc[monthLabel] = (data[key] / 3600).toFixed(2);
                    }
                    return acc;
                }, {});

                setMonthlyWorkHours(hoursData);
            })
            .catch(error => console.error('Error fetching monthly work hours:', error));
    };

    const handleDateChange = (date) => {
        const kstDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000) + 9 * 60 * 60 * 1000);
        setSelectedDate(kstDate);
    };

    const handleEndWork = (id) => {
        fetch(`/api/worktime/end/${id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                setCurrentWorkTimeId(null);
                fetchDailyWorkHours(selectedDate);
            })
            .catch(error => console.error('Error ending work:', error));
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && workedDays.find(d => d.toDateString() === date.toDateString())) {
            return 'worked-day';
        }
        return null;
    };

    const dailyData1 = {
        labels: ['23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13','12'],
        datasets: [
            {
                label: 'Work Duration (in minutes)',
                data: ['23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13','12'].map(hour => parseFloat(workHours[hour] || 0)),
                backgroundColor: 'rgba(74,92,255)',
                borderColor: 'rgba(74,92,255)',
                borderWidth: 1,
            },
        ],
    };

    const dailyData2 = {
        labels: ['11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1','0'],
        datasets: [
            {
                label: 'Work Duration (in minutes)',
                data: ['11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1','0'].map(hour => parseFloat(workHours[hour] || 0)),
                backgroundColor: 'rgba(74,92,255)',
                borderColor: 'rgba(74,92,255)',
                borderWidth: 1,
            },
        ],
    };

    const weeklyData = {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [
            {
                label: 'Work Duration (in hours)',
                data: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => parseFloat(weeklyWorkHours[day] || 0)),
                backgroundColor: 'rgba(74,92,255)',
                borderColor: 'rgba(74,92,255)',
                borderWidth: 1,
            },
        ],
    };

    const monthlyData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
            {
                label: 'Work Duration (in hours)',
                data: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(month => parseFloat(monthlyWorkHours[month] || 0)),
                backgroundColor: 'rgba(254, 149, 52)',
                borderColor: 'rgba(254, 149, 52)',
                borderWidth: 1,
            },
        ],
    };

    const dailyOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 60,
                ticks: {
                    stepSize: 30,
                    display: false,
                },
            },
            x: {
                ticks: {
                    stepSize: 1,
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const minutes = Math.floor(value);
                        const seconds = Math.floor((value - minutes) * 60);
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
                max: 10,
                ticks: {
                    stepSize: 5,
                    display: false,
                    callback: function (value) {
                        return `${value}h`;
                    },
                },
            },
            x: {
                ticks: {
                    stepSize: 1,
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const hours = Math.floor(value);
                        const minutes = Math.floor((value - hours) * 60);
                        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
                    },
                },
            },
        },
    };

    const monthlyOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 180,
                ticks: {
                    stepSize: 90,
                    display: false,
                    callback: function (value) {
                        return `${value}h`;
                    },
                },
            },
            x: {
                ticks: {
                    stepSize: 1,
                    color: 'black',
                    font: {
                        weight: 'bold',
                    },
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const hours = Math.floor(value);
                        const minutes = Math.floor((value - hours) * 60);
                        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <div className="Wrapper1">
                <div className="calendar-container">
                    <Calendar onChange={handleDateChange} tileClassName={tileClassName}/>
                </div>

                <div className="chart-container">
                    <div className="TextWrapper">
                        <h2>한눈에 확인하는 나의 근무 시간</h2>
                        <h3>앉은 자리에서 버튼 하나로 기록해요!</h3>
                    </div>

                    <div className={`chartWrapper ${activeTab}`}> {/* 수정된 부분 */}
                        {activeTab === 'daily' && (
                            <>
                                <h3 className="today"> 오늘 {Math.floor(totalWorkDuration / 60)}시간 {Math.floor(totalWorkDuration % 60)}분</h3>
                                <div className="chart-inner-container">
                                    <Bar data={dailyData1} options={dailyOptions} height={150} />
                                </div>
                                <div className="chart-inner-container">
                                    <Bar data={dailyData2} options={dailyOptions} height={150} />
                                </div>

                                {currentWorkTimeId && (
                                    <button onClick={() => handleEndWork(currentWorkTimeId)}>End Current Work</button>
                                )}
                            </>
                        )}
                        {activeTab === 'weekly' && (
                            <>
                                <h3>Weekly Overview</h3>
                                <Bar data={weeklyData} options={weeklyOptions} />
                            </>
                        )}
                        {activeTab === 'monthly' && (
                            <>
                                <h3>Monthly Overview</h3>
                                <h4 className="subheading">Average time you spent month</h4>
                                <Bar data={monthlyData} options={monthlyOptions}/>
                            </>
                        )}

                        {activeTab !== 'daily' && (
                            <div className="svgWrapper">
                                <img src={good} />
                            </div>
                        )}
                    </div>

                    <div className="tabs">
                        <button className={`tab ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}></button>
                        <button className={`tab ${activeTab === 'weekly' ? 'active' : ''}`} onClick={() => setActiveTab('weekly')}></button>
                        <button className={`tab ${activeTab === 'monthly' ? 'active' : ''}`} onClick={() => setActiveTab('monthly')}></button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default WorkTimeChart;
