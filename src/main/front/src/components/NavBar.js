import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import PersonIcon from './icons/black/person.svg';
import Logo from './icons/black/Logo.svg';
import LogoutIcon from './icons/black/logout.svg';

const NavBar = () => {
    const handleLogout = () => {
        alert('이미 로그아웃 상태입니다.');
    };


    const handleLinkClick = (e) => {
        e.preventDefault();
        alert('로그인 후 이용가능합니다.');
    };


    return (
        <header>
            <nav className="navbar">
                <div className="left-menu">
                    <Link to="/main">
                        <img src={Logo} alt="Logo" className="logo" />
                    </Link>
                    <ul className="menu">
                    <li>
                        <Link to="/record" onClick={handleLinkClick}>Record</Link></li>
                        <li><Link to="/stretching" onClick={handleLinkClick}>Stretch</Link></li>
                    </ul>
                </div>
                <div className="right-menu">
                    <ul className="menu icons2">
                        <li><a href="/login"><img src={PersonIcon} alt="User" /></a></li>
                        <li><a onClick={handleLogout} style={{ cursor: 'pointer' }}><img src={LogoutIcon} alt="Logout" /></a></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
