import React from 'react';
import './Popup.css';
import CloseIcon from './icons/popup/popup_close.svg';
import CheckIcon from './icons/popup/popup_check.svg';

const Popup = ({ onClose, onConfirm }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <button className="popup-close" onClick={onClose}>
                        <img src={CloseIcon} alt="Close" className="close-icon" />
                    </button>
                </div>
                <div className="popup-body">
                    <img src={CheckIcon} alt="Check" className="check-icon" />
                    <h2>Successfully completed!</h2>
                    <p>설정하신 시간이 지났습니다!<br/>
                    이제 눈 스트레칭 시간을 가져볼까요?</p>
                </div>
                <div className="popup-footer">
                    <button className="popup-button" onClick={onConfirm}>수락</button>
                    <button className="popup-button cancel" onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
