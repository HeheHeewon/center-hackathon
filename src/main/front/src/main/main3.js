import './mainn.css';
import React from 'react';
import img from './main3.svg';

function Main3() {
    return (
        <div className="m3-container">

            <div className="m3-textbox">
                <div className='orange-text'>기록</div>
                <div className="black-bold-text">
                    <div>근무시간 기록</div>
                    <div>하루부터 주간월간까지!</div>
                </div>
            </div>
            
            <img src={img} className="m3-img" alt="img"/>  

        </div>
    );
}

export default Main3;
