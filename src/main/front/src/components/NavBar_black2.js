import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar_black.css';
import PersonIcon from './icons/white/person.svg';
import Logo from './icons/white/Logo.svg';
import LogoutIcon from './icons/white/logout.svg';

const NavBar = () => {
    const navigate = useNavigate();

    const handlePersonIconClick = () => {
        alert('이미 로그인 되었습니다');
    };

    const handleLogoutIconClick = () => {
        alert('로그아웃 되었습니다');
        setTimeout(() => {
            navigate('/main');
        }, 100);
    };

    return (
        <header>
            <nav className="navbar">
                <div className="left-menu">
                    <Link to="/main2">
                        <img src={Logo} alt="Logo" className="logo" />
                    </Link>
                    <ul className="white_menu">
                        <li><Link to="/record">Record</Link></li>
                        <li><Link to="/stretching">Stretch</Link></li>
                    </ul>
                </div>
                <div className="right-menu">
                    <ul className="menu icons3">
                        <li><a href="#!" onClick={handlePersonIconClick}>
                            <img src={PersonIcon} alt="User" style={{ opacity: 0.5 }} />
                        </a></li>
                        <li><a href="#!" onClick={handleLogoutIconClick}>
                            <img src={LogoutIcon} alt="Logout" />
                        </a></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
