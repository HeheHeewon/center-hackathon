import React, { useState } from 'react';
import './ForgotPassword.css';
import NavBar from './NavBar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isFormValid = () => {
        return email && password && confirmPassword && (password === confirmPassword);
    };

    return (
        <div className="App">
            <NavBar/>
            <main className="forgotPassword-main">
                <div className="forgotPassword-container">
                    <h2>암호 재설정</h2>
                    <p>계속하려면 서비스에서 사용하는 이메일 주소를 입력하십시오.</p>
                    <form className="forgotPassword-form">
                        <div className="email-container">
                            <input
                                type="email"
                                placeholder="이메일"
                                className="forgotPassword-input email-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="password-container">
                            <input
                                type="password"
                                placeholder="암호"
                                className="forgotPassword-input password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="confirm-password-container">
                            <input
                                type="password"
                                placeholder="암호 확인"
                                className="forgotPassword-input confirm-password-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="forgotPassword-button"
                            disabled={!isFormValid()}
                        >
                            계속
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;