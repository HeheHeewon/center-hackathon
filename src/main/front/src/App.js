import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import WorkTimeTracker from './components/WorkTimeTracker';
import WorkTimeChart from './components/WorkTimeChart';
import NavBar from './NavBar';
import './App.css';

function App() {
    const [backgroundClass, setBackgroundClass] = useState('background-white');

    const handleBackgroundChange = (state) => {
        switch (state) {
            case 'start':
                setBackgroundClass('background-start');
                break;
            case 'pause':
                setBackgroundClass('background-pause');
                break;
            case 'resume':
                setBackgroundClass('background-resume');
                break;
            case 'stop':
                setBackgroundClass('background-stop');
                break;
            default:
                setBackgroundClass('background-white');
        }
    };

    useEffect(() => {
        document.body.className = backgroundClass;
    }, [backgroundClass]);

    return (
        <Router>
            <div className="app-container">
                <NavBar />
                <div className="section1">
                    <WorkTimeTracker onBackgroundChange={handleBackgroundChange} />
                </div>
                <div className="section2">
                    <WorkTimeChart />
                </div>
            </div>
        </Router>
    );
}

export default App;
