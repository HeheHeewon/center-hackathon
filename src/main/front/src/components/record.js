import React, { useState, useEffect } from 'react';
import WorkTimeTracker from './WorkTimeTracker';
import WorkTimeChart from './WorkTimeChart';
import NavBar from './NavBar_black';
import './record.css';

const Record = () => {
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
            <div className="app-container">
                <NavBar />
                <div className="section1">
                    <WorkTimeTracker onBackgroundChange={handleBackgroundChange} />
                </div>
                <div className="section2">
                    <WorkTimeChart />
                </div>
            </div>
    );
}

export default Record;