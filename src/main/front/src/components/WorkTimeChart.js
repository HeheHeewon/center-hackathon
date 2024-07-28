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

    // `selectedDate.getFullYear()`의 값을 별도의 변수로 추출
    const selectedYear = selectedDate.getFullYear();

    // 이 부분에서 selectedYear를 의존성 배열에 포함시킵니다.
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
        fetch(`/api/worktime/weekly?startDate=${startDateString}`)
            .then(response => response.json())
            .then(data => {
                const hoursData = Object.keys(data).reduce((acc, day) => {
                    acc[day] = (data[day] / 3600).toFixed(3); // 초를 시간 단위로 변환
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
                console.log("서버에서 받은 월별 데이터:", data);

                // 서버 데이터의 월 키를 클라이언트 라벨에 맞게 변환
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
                        acc[monthLabel] = (data[key] / 3600).toFixed(2); // 초를 시간 단위로 변환하여 설정
                    }
                    return acc;
                }, {});

                console.log("처리된 월별 근무 시간 데이터:", hoursData);

                // 상태 설정
                setMonthlyWorkHours(hoursData);

                // 데이터와 라벨 길이 확인
                const labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                const dataArray = labels.map(month => {
                    const value = parseFloat(hoursData[month] || 0);
                    console.log(`${month} 데이터 값: ${value}`); // 각 월별 데이터 값을 출력하여 확인
                    return value;
                });

                console.log('월별 라벨:', labels);
                console.log('월별 데이터:', dataArray);
                console.log('라벨 길이:', labels.length);
                console.log('데이터 길이:', dataArray.length);

                // NaN 값 검사
                dataArray.forEach(value => {
                    if (isNaN(value)) {
                        console.error('데이터에 NaN 값이 감지되었습니다:', value);
                    }
                });
            })
            .catch(error => console.error('월별 근무 시간 데이터를 가져오는 중 오류 발생:', error));
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
                label: 'Work Duration (in hours)',
                data: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => parseFloat(weeklyWorkHours[day] || 0)),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const monthlyData = {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        datasets: [
            {
                label: 'Work Duration (in hours)',
                data: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(month => {
                    const value = parseFloat(monthlyWorkHours[month] || 0);
                    console.log(`${month} 데이터 값: ${value}`); // 각 월별 데이터 값을 출력하여 확인
                    if (isNaN(value)) {
                        console.error(`NaN 값이 ${month}월에 감지되었습니다`);
                    }
                    return value;
                }),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    console.log('월별 데이터 차트:', monthlyData); // monthlyData 객체를 콘솔에 출력하여 확인

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
                title: {
                    display: true,
                    text: 'Work Duration (hours)',
                },
                ticks: {
                    stepSize: 2,
                    callback: function (value) {
                        return `${value}h`;
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
                max: 180, // y축 최대값을 180으로 설정
                title: {
                    display: true,
                    text: 'Work Duration (hours)',
                },
                ticks: {
                    callback: function (value) {
                        return `${value}h`;
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
            },
        },
        plugins: {
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
            <h2>Work Duration Chart</h2>
            <Calendar
                onChange={handleDateChange}
                tileClassName={tileClassName}
            />
            <Bar data={dailyData} options={dailyOptions}/>
            <h3>Total Work Duration: {Math.floor(totalWorkDuration / 60)}h {Math.floor(totalWorkDuration % 60)}m</h3>
            {currentWorkTimeId && (
                <button onClick={() => handleEndWork(currentWorkTimeId)}>End Current Work</button>
            )}
            <h2>Weekly Work Duration Chart</h2>
            <Bar data={weeklyData} options={weeklyOptions}/>
            <h2>Monthly Work Duration Chart</h2>
            <Bar data={monthlyData} options={monthlyOptions}/>
        </div>
    );
}

export default WorkTimeChart;