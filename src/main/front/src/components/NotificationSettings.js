import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationSetting = ({ userId }) => {
    const [interval, setInterval] = useState('');
    const [savedInterval, setSavedInterval] = useState(null);
    const [message, setMessage] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        // 서버에서 현재 설정된 알림 주기를 가져옵니다.
        axios.get(`/api/notification/${userId}`)
            .then(response => {
                if (response.data) {
                    setSavedInterval(response.data.interval);
                    setLastUpdated(new Date().toLocaleString());
                }
            })
            .catch(error => {
                console.error("There was an error fetching the notification setting!", error);
            });
    }, [userId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`/api/notification/${userId}`, { interval })
            .then(response => {
                setSavedInterval(response.data.interval);
                setMessage('Notification interval updated successfully!');
                setLastUpdated(new Date().toLocaleString());
            })
            .catch(error => {
                console.error("There was an error updating the notification setting!", error);
            });
    };

    return (
        <div>
            <h2>Notification Setting</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Select Interval:
                    <select value={interval} onChange={(e) => setInterval(e.target.value)}>
                        <option value="">Select an interval</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                    </select>
                </label>
                <button type="submit">Save</button>
            </form>
            {savedInterval && (
                <div>
                    <p>Current Interval: {savedInterval} minutes</p>
                    <p>Last Updated: {lastUpdated}</p>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default NotificationSetting;
