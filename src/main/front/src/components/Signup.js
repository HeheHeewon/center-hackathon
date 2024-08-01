import React, { useState } from 'react';
import './Signup.css';
import NavBar from './NavBar';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSignup = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        const requestBody = {
            email,
            password,
            confirmPassword
        };

        try {
            const response = await fetch('http://localhost:8080/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include' // credentials 옵션 설정
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Signup successful:', data);
                setSuccessMessage('회원가입에 성공했습니다.');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || '알 수 없는 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            setErrorMessage('서버에 연결할 수 없습니다.');
        }
    };

    const isFormValid = () => {
        return email && password && confirmPassword && (password === confirmPassword);
    };

    return (
        <div className="App">
        <NavBar/>
        <div className="signup-main">
            <div className="signup-container">
                <h2>회원가입</h2>
                <form className="signup-form" onSubmit={handleSignup}>
                    <div className="input-container">
                        <input
                            type="email"
                            placeholder="이메일"
                            className="signup-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            className="signup-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            placeholder="비밀번호 확인"
                            className="signup-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="signup-button" disabled={!isFormValid()}>
                        가입하기
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>
            </div>
        </div>
        </div>
    );
};

export default Signup;
