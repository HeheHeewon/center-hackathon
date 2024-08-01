import React from 'react';
import './NavBarStyles.css';
import PersonIcon from './icons/white/person.svg';
import Logo from './icons/white/Logo.svg';  

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
                        <li><a href="/#user"><img src={PersonIcon} alt="User" /></a></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
