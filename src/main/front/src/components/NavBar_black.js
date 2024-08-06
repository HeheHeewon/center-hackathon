import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar_black.css';
import PersonIcon from './icons/white/person.svg';
import Logo from './icons/white/Logo.svg';
import LogoutIcon from './icons/white/logout.svg';


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
                    <ul className="white_menu">
                        <li><Link to="/record" onClick={handleLinkClick}>Record</Link></li>
                        <li><Link to="/stretching" onClick={handleLinkClick}>Stretch</Link></li>
                    </ul>
                </div>
                <div className="right-menu">
                    <ul className="menu icons3">
                        <li><Link to="/login"><img src={PersonIcon} alt="User" /></Link></li>
                            <li><a href="#!" onClick={handleLogout}><img src={LogoutIcon} alt="Logout" style={{ opacity: 0.5 }} /></a></li>

                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
