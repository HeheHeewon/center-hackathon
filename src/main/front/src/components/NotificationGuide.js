import React, { useState, useEffect } from 'react';

function NotificationGuide() {
    const [guides, setGuides] = useState([]);

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = () => {
        fetch('/api/notification-guides')
            .then(response => response.json())
            .then(data => setGuides(data))
            .catch(error => console.error('Error fetching guides:', error));
    };

    return (
        <div>
            <h1>Notification Guide</h1>
            <ul>
                {guides.map(guide => (
                    <li key={guide.id}>
                        <h2>{guide.title}</h2>
                        <p>{guide.description}</p>
                        <img src={guide.imageUrl} alt={guide.title} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotificationGuide;
