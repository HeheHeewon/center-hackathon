import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isFormValid = () => {
        return email && password && confirmPassword && (password === confirmPassword);
    };

    return (
        <div className="App">
            <main className="signup-main">
                <div className="signup-container">
                    <h2>(서비스 이름) ID 생성</h2>
                    <p>ID 생성을 통해 (서비스 이름) 서비스를 이용할 수 있습니다.</p>
                    <form className="signup-form">
                        <div className="email-container">
                            <input 
                                type="email" 
                                placeholder="이메일" 
                                className="signup-input email-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <p className="helper-text">서비스 ID로 사용될 이메일입니다.</p>
                        <div className="password-container">
                            <input 
                                type="password" 
                                placeholder="암호" 
                                className="signup-input password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="confirm-password-container">
                            <input 
                                type="password" 
                                placeholder="암호 확인" 
                                className="signup-input confirm-password-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="signup-button"
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

export default Signup;
