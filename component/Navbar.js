import React from 'react';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li><a href="/" className={styles.link}>Welcome</a></li>
        <li><a href="/Login" className={styles.link}>Login</a></li>
        <li><a href="/About" className={styles.link}>About</a></li>
        <li><a href="/Contact" className={styles.link}>Contact Us!</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
