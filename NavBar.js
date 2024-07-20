import React from 'react';
import './NavBarStyles.css';
import BellIcon from './icons/bell.svg';
import PersonIcon from './icons/person.svg';
import Logo from './icons/Logo.png'; 

const NavBar = () => {
    return (
        <header>
            <nav className="navbar">
                <div className="left-menu">
                    <img src={Logo} alt="Logo" className="logo" />
                    <ul className="menu">
                        <li><a href="/#record">Record</a></li>
                        <li><a href="/#stretch">Stretch</a></li>
                    </ul>
                </div>
                <div className="right-menu">
                    <ul className="menu icons">
                        <li><a href="/#notifications"><img src={BellIcon} alt="Notifications" /></a></li>
                        <li><a href="/#user"><img src={PersonIcon} alt="User" /></a></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
