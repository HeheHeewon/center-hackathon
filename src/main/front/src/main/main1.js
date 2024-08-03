import './mainn.css';
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import icons from './main1.svg';
import text from './main1_text.svg';

function Main1() {
    const navigate = useNavigate(); 

    const handleButtonClick = () => {
        navigate('/'); 
    };

    return (
        <div className="m1-container">
            <img src={icons} className="icons" alt="mainsvg"/>

            <div className="m1-textbox">
                <img src={text} className="texts" alt ="texts"/>
                <button className="custom-button" onClick={handleButtonClick}>
                    <span>자세히 보기</span>
                    <span className="arrow">&rarr;</span>
                </button>
            </div>

        </div>
    );
}

export default Main1;
