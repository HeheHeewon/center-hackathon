import './mainn.css';
import React from 'react';
import icons from './main1.svg';
import text from './main1_text.svg';

function Main1() {
    return (
        <div className="m1-container">
            <img src={icons} className="icons" alt="mainsvg"/>

            <div className="m1-textbox">
                <img src={text} className="texts" alt ="texts"/>
                <button className="custom-button">
                    <span>자세히 보기</span>
                    <span className="arrow">&rarr;</span>
                </button>
            </div>

        </div>
    );
}

export default Main1;
