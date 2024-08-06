import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import ArrowIcon from './icons/arrow.svg';
import NavBar from './NavBar';
import { useAuth } from './AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { setIsLoggedIn } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const requestBody = {
            username: email,  // Spring Security에서 요구하는 필드명으로 변경
            password: password
        };

        try {
            const response = await fetch('https://port-0-center-hackathon1-lzifj2fc89e7cae1.sel4.cloudtype.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(requestBody),
                credentials: 'include' // 필요한 경우 쿠키를 포함시키기
            });

            if (response.ok) {
                console.log('Login successful');
                setIsLoggedIn(true);
                window.location.href = '/main2';
            } else {
                // 로그인 실패 시 에러 처리
                if (response.status === 401) {
                    setErrorMessage('Invalid credentials. Please try again.');
                } else {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Login failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An unknown error occurred.');
        }
    };

    return (
        <div className="App">
            <NavBar />
            <main className="login-main">
                <div className="login-container">
                    <h3>Noti's 에 로그인 하세요</h3>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="아이디"
                                className="login-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
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
                        <Link to="/forgotPassword">암호를 잊으셨습니까?</Link>
                        <div className="signup-link">
                            <span>Noti's ID가 없으십니까? </span>
                            <a href="/signup">지금 만드세요.</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Login;
