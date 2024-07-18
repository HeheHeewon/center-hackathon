import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function WorkTimeChart() {
    const [dailyData, setDailyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        fetchWorkTimeData('daily');
        fetchWorkTimeData('weekly');
        fetchWorkTimeData('monthly');
    }, []);

    const fetchWorkTimeData = (period) => {
        fetch(`/api/worktime/${period}?date=${new Date().toISOString()}`)
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(workTime => ({
                    x: new Date(workTime.startTime),
                    y: (new Date(workTime.endTime) - new Date(workTime.startTime)) / 3600000 // hours
                }));
                if (period === 'daily') setDailyData(formattedData);
                else if (period === 'weekly') setWeeklyData(formattedData);
                else if (period === 'monthly') setMonthlyData(formattedData);
            })
            .catch(error => console.error(`Error fetching ${period} work times:`, error));
    };

    const createChartData = (data) => ({
        datasets: [
            {
                label: 'Work Time (hours)',
                data: data,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.1
            }
        ]
    });

    return (
        <div>
            <h2>Daily Work Time</h2>
            <Line data={createChartData(dailyData)} />

            <h2>Weekly Work Time</h2>
            <Line data={createChartData(weeklyData)} />

            <h2>Monthly Work Time</h2>
            <Line data={createChartData(monthlyData)} />
        </div>
    );
}

export default WorkTimeChart;
