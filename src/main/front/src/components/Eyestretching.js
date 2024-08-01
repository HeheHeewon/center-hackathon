import React, { useState, useEffect } from 'react';
import './Eyestretching.css';
import Eye1 from './icons/eyes/eye1.svg';
import Eye2 from './icons/eyes/eye2.svg';
import Eye3 from './icons/eyes/eye3.svg';
import Eye4 from './icons/eyes/eye4.svg';

const eyeImages = [Eye1, Eye2, Eye3, Eye4];
const messages = [
    '10초간 유지해주세요.',
    '다시 10초간 유지해주세요.',
    '또 다시 10초간 유지해주세요.',
    '마지막 동작입니다!'
];

const EyeStretching = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [showMessage, setShowMessage] = useState(true);  // 처음 텍스트 박스 보이기
    const [messageIndex, setMessageIndex] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const cycleImages = setInterval(() => {
            if (currentImage < eyeImages.length - 1) {
                setShowMessage(false);
                setTimeout(() => {
                    setCurrentImage(prev => (prev + 1) % eyeImages.length);
                    setMessageIndex(prev => (prev + 1) % messages.length);
                    setShowMessage(true);
                    setTimeout(() => {
                        setShowMessage(false);
                    }, 8000); // 메시지 8초 동안 표시
                }, 1000); // 이미지 변경 1초 후 메시지 표시
            } else {
                setCompleted(true);
                setShowMessage(false); // 메시지를 숨깁니다.
                clearInterval(cycleImages);
            }
        }, 10000); // 10초 주기로 실행

        return () => clearInterval(cycleImages); // 컴포넌트 언마운트 시 타이머 클리어
    }, [currentImage]);

    const restart = () => {
        setFadeOut(true);
        setTimeout(() => {
            setCurrentImage(0);
            setMessageIndex(0);
            setCompleted(false);
            setShowMessage(true);
            setFadeOut(false);
        }, 500); // 페이드아웃 애니메이션 시간과 동일하게 설정
    };

    return (
        <div className="eye-stretch-container">
            <h1>Keep your eye healthy with noti's</h1>
            <a>천천히 따라해주세요.</a>
            <img src={eyeImages[currentImage]} alt="Eye Exercise" className="eye-image" />
            {showMessage && !completed && (
                <div className="message-box fade-in-out">
                    <p>{messages[messageIndex]}</p>
                </div>
            )}
            {completed && (
                <div className={`completed-box fade-in ${fadeOut ? 'fade-out' : ''}`}>
                    <p>잘하셨어요! 더 많은 운동은 아래에 첨부되어 있습니다</p>
                    <button className="restart-button" onClick={restart}>다시 한번 하시겠어요?</button>
                </div>
            )}
        </div>
    );
}

export default EyeStretching;
