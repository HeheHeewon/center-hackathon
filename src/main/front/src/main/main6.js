import './mainn.css';
import React from 'react';
import img from './main6.svg';

function Main6() {
    return (
        <div className="m6-container">

            <div className="m6-textbox">
                <div className='orange-text'>스트레칭</div>
                <div className="black-bold-text">
                    <div>Noti's의 눈 움직임을 따라</div>
                    <div>눈건강까지 챙겨요!</div>
                </div>
            </div>
            
            <img src={img} className="m6-img" alt="img"/>  

        </div>
    );
}

export default Main6;
