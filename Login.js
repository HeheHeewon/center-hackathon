import React from 'react';
import './Login.css';
import ArrowIcon from './icons/arrow.svg';

const Login = () => {
    return (
        <div className="App">
            <main className="login-main">
                <div className="login-container">
                    <h3>(서비스 이름)에 로그인 하세요</h3>
                    <form className="login-form">
                        <div className="input-container">
                            <input type="email" placeholder="아이디" className="login-input" />
                        </div>
                        <div className="input-container">
                            <input type="password" placeholder="비밀번호" className="login-input" />
                            <button type="submit" className="arrow-button">
                                <img src={ArrowIcon} alt="arrow" className="arrow-icon" />
                            </button>
                        </div>
                    </form>
                    <div className="login-links">
                        <a href="#forgot-password">암호를 잊으셨습니까?</a>
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
