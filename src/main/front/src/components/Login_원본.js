import React, { useState } from 'react';
import './Login.css';
import ArrowIcon from './icons/arrow.svg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 로그인 폼 데이터를 로컬에서 처리하지 않고, form 요소의 기본 동작을 통해 서버로 전송
        // Spring Security가 이를 처리하게 함
        document.getElementById("login-form").submit();
    };

    return (
        <div className="App">
            <main className="login-main">
                <div className="login-container">
                    <h3>(서비스 이름)에 로그인 하세요</h3>
                    <form id="login-form" action="https://center-hackathon1:8080/login" method="POST" className="login-form" onSubmit={handleSubmit}>
                        <div className="input-container">
                            <input
                                type="email"
                                name="username" // Spring Security 기본 요구 사항에 맞춰 필드 이름 변경
                                placeholder="아이디"
                                className="login-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
                                name="password" // Spring Security 기본 요구 사항에 맞춰 필드 이름 변경
                                placeholder="비밀번호"
                                className="login-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit" className="arrow-button">
                                <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                            </button>
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                    <div className="login-links">
                        <a href="/forgotPassword">암호를 잊으셨습니까?</a>
                        <div className="signup-link">
                            <span>(서비스 이름) ID가 없으십니까? </span>
                            <a href="/signup">지금 만드세요.</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Login;
