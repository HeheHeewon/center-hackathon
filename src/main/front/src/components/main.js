import React from 'react';
import NavBar from './NavBar_black';
import './main.css';

import Main1 from '../main/main1';
import Main2 from '../main/main2';
import Main3 from '../main/main3';
import Main4 from '../main/main4';
import Main5 from '../main/main5';
import Main6 from '../main/main6';
import Main7 from '../main/main7';

const main = () => {
    return (
        <div className="app-container">
            <NavBar />
            <div className="section sec1">
                <Main1 />
            </div>

            <div className="section sec2">
                <Main2 />
            </div>
            
            <div className="section sec3">
                <Main3 />
            </div>
            
            <div className="section sec4">
                <Main4 />
            </div>
            
            <div className="section sec5">
                <Main5 />
            </div>
            
            <div className="section sec6">
                <Main6 />
            </div>

            <div className="section sec7">
                <Main7 />
            </div>
        </div>
    );
}

export default main;