import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import Login from './Login';
import Signup from './Signup';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <NavBar /> 
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
