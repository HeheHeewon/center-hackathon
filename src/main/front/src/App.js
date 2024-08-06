import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Record from "./components/Record";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Timer from "./components/Timer";
import Stretching from './components/Stretching';
import ForgotPassword from "./components/ForgotPassword";
import Main from "./components/main";
import Main2 from "./components/main2";
import NavBar from './components/NavBar_black';

import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Navigate to="/main" />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgotPassword" element={<ForgotPassword />} />
                        <Route path="/timer" element={<Timer />} />
                        <Route path="/stretching" element={<Stretching />} />
                        <Route path="/main" element={<Main />} />
                        <Route path="/record" element={<Record />} />
                        <Route path="/main2" element={<Main2 />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
