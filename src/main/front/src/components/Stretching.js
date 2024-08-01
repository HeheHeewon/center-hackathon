import React from 'react';
import NavBar from './NavBar_black';
import './Stretching.css';
import EyeStretching from './Eyestretching';
import StretchVideo from './StretchVideo';

const Stretching = () => {
    return (
        <div className="app-container">
            <NavBar />
            <div className="section1">
                <EyeStretching />
            </div>
            <div className="section2">
                <StretchVideo />
            </div>
        </div>
    );
}

export default Stretching;