import './mainn.css';
import React from 'react';
import img from './main7.svg';

function Main7() {
    return (
        <div className="m7-container">

            <div className="m7-textbox">
                <div className='orange-text'>스트레칭 전용 알람</div>
                <div className="black-bold-text">
                    <div>타이머 설정과 함께</div>
                    <div>눈 스트레칭까지 해결</div>
                </div>
                <div className="black-text">
                    <div>직접 스트레칭 영상을 찾아볼 필요없이,</div>
                    <div>15분/30분/45분/60분 타이머 종료 후</div>
                    <div>눈 스트레칭을 따라하면서 눈 건강도 챙기세요.</div>
                </div>
            </div>
            
            <img src={img} className="m7-img" alt="img"/>  
            <div className="Footer">ITSWU</div>
        </div>
    );
}

export default Main7;
