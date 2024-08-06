import './mainn.css';
import React from 'react';
import img from './main4.svg';

function Main4() {
    return (
        <div className="m4-container">

            <div className="m4-textbox">
                <div className='orange-text'>하루/주간/월간 기록</div>
                <div className="black-bold-text">
                    <div>한눈에 보는 내가 출근한 날!</div>
                </div>
                <div className="black-text">
                    <div>달력을 통해 내가 출근한 날을 빠르게 확인하고,</div>
                    <div>그래프를 통해서 얼마나 일했는지 확인해 볼까요?</div>
                </div>
            </div>
            
            <img src={img} className="m4-img" alt="img"/>  

        </div>
    );
}

export default Main4;
