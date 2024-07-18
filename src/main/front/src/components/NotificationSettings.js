import React, { useState, useEffect } from 'react';

function NotificationSettings() {
    const [interval, setInterval] = useState(30);
    const [settings, setSettings] = useState([]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = () => {
        fetch('/api/notification-settings')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSettings(data);
                } else {
                    setSettings([]);
                }
            })
            .catch(error => {
                console.error('Error fetching settings:', error);
                setSettings([]);
            });
    };

    const saveSetting = () => {
        fetch('/api/notification-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notificationInterval: interval }),
        })
            .then(response => response.json())
            .then(() => fetchSettings())
            .catch(error => console.error('Error saving setting:', error));
    };

    return (
        <div>
            <h1>Notification Settings</h1>
            <input
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                placeholder="Enter interval in minutes"
            />
            <button onClick={saveSetting}>Save</button>
            <ul>
                {settings.map(setting => (
                    <li key={setting.id}>
                        Interval: {setting.notificationInterval} minutes
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotificationSettings;
