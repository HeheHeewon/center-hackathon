import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WorkTimeTracker from './components/WorkTimeTracker';
import WorkTimeChart from './components/WorkTimeChart';
import NavBar from './NavBar';
import './App.css';

function App() {
    return (
        <Router>     
                <div className="app-container">
                    <NavBar />
                    <div className="section1">
                        <WorkTimeTracker />
                    </div>
                    <div className="section2">
                        <WorkTimeChart />
                    </div>
                </div>

                <Routes>
                    <Route path="/" element={<WorkTimeTracker />} />
                    <Route path="/charts" element={<WorkTimeChart />} />
                </Routes>
 
        </Router>
    );
}

export default App;
