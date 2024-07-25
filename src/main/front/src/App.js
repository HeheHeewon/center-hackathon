import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import WorkTimeTracker from './components/WorkTimeTracker';
import WorkTimeChart from './components/WorkTimeChart';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Work Time Tracker</Link>
                        </li>
                        <li>
                            <Link to="/charts">Work Time Chart</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<WorkTimeTracker />} />
                    <Route path="/charts" element={<WorkTimeChart />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
