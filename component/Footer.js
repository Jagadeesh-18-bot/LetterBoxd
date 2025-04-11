import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p> {new Date().getFullYear()} Letterboxd Clone. All rights reserved.</p>
      <div className={styles.links}>
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
        <a href="/contact">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;
