import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Contact.module.css'; // Linking to the CSS file

const Contact = () => {
  const router = useRouter();

  const goToDashboard = () => {
    router.push('/dashboard'); // this Navigates to dashboard
  };

  return (
    <div className={styles.contactContainer}>
      <h1 className={styles.heading}>Contact Us</h1>
      <div className={styles.infoBox}>
        <p><strong>📱 Mobile:</strong> +91 7013631730</p>
        <p><strong>📧 Email:</strong> kota.jagadesh123@gmail.com</p>
        <p><strong>💻 GitHub:</strong> <a href="https://github.com/Jagadeesh-18-bot" target="_blank" rel="noopener noreferrer">Jagadeesh-18-bot</a></p>
        <button className={styles.dashboardButton} onClick={goToDashboard}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Contact;
