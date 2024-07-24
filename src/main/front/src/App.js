import React from 'react';
import WorkTimeTracker from './components/WorkTimeTracker';
// import WorkTimeChart from './components/WorkTimeChart';
import NotificationSettings from './components/NotificationSettings';

function App() {
    const userId = 1; // 예시 사용자 ID

    return (
        <div>
            <h1>Work Time Tracker and Notification Settings</h1>
            <WorkTimeTracker />
            <NotificationSettings userId={userId} />
        </div>
    );
}

export default App;
