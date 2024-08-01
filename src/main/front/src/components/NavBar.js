import React from 'react';
import './NavBarStyles.css';
import PersonIcon from './icons/black/person.svg';
import Logo from './icons/black/Logo.svg'; 

const NavBar = () => {
    return (
        <header>
            <nav className="navbar">
                <div className="left-menu">
                    <img src={Logo} alt="Logo" className="logo" />
                    <ul className="menu">
                        <li><p href="/#record">Record</p></li>
                        <li><p href="/#stretch">Stretch</p></li>
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
