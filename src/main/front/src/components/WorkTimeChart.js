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

    useEffect(() => {
        const today = new Date();
        fetchWorkedDays(today.getFullYear(), today.getMonth() + 1);
    }, []);

    useEffect(() => {
        fetchDailyWorkHours(selectedDate);
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
            })
            .catch(error => console.error('Error fetching daily work hours:', error));
    };

    const handleDateChange = (date) => {
        const kstDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000) + 9 * 60 * 60 * 1000); // KST 적용
        console.log(`Date selected: ${kstDate}`);
        setSelectedDate(kstDate);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && workedDays.find(d => d.toDateString() === date.toDateString())) {
            return 'worked-day';
        }
        return null;
    };

    const data = {
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

    const options = {
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

    console.log('Chart data:', data);

    return (
        <div>
            <h2>Work Duration Chart</h2>
            <Calendar
                onChange={handleDateChange}
                tileClassName={tileClassName}
            />
            <Bar data={data} options={options} />
        </div>
    );
}

export default WorkTimeChart;
