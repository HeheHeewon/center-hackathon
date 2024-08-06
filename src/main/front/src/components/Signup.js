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
            const response = await fetch('https://port-0-center-hackathon1-lzifj2fc89e7cae1.sel4.cloudtype.app/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
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
        <NavBar />
        <main className="signup-main">
            <div className="signup-container">
                 <h2>Noti's' ID 생성</h2>
                 <p>ID 생성을 통해 Noti's' 서비스를 이용할 수 있습니다.</p>
                <form className="signup-form" onSubmit={handleSignup}>
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
                    <button type="submit" className="signup-button" disabled={!isFormValid()}>
                        계속
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>
            </div>
        </main>
        </div>
    );
};

export default Signup;
