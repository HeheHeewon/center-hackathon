import './mainn.css';
import React from 'react';
import img from './main5.svg';

function Main5() {
    return (
        <div className="m5-container">

            <div className="m5-textbox">
                <div className='orange-text'>하루/주간/월간 그래프</div>
                <div className="black-text">
                    <div className="left">하루 그래프를 통해서 어느 시간대에 얼만큼 일했는지 확인하고,</div>
                    <div className="left">주간 그래프를 통해서 목표 달성을 했는지 확인하고,</div>
                    <div className="left">월간 그래프를 통해서 어느 달에 가장 많이 일을 했는지 한 눈에 확인하세요.</div>
                </div>
            </div>
            
            <img src={img} className="m5-img" alt="img"/>  

        </div>
    );
}

export default Main5;
