import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Contact.module.css';
// Contact Component
const Contact = () => {
  const router = useRouter(); 

  const goToDashboard = () => {
    router.push('/dashboard');
  };
// Contact Page Content
  return (
    <div className={styles.fullPage}>
      <img src="ME.jpeg" alt="Logo" className={styles.logo} />
      <h1 className={styles.heading}>Contact Us 🎧  </h1>
      <div className={styles.infoGroup}>
        <p><strong>📱 Mobile:</strong> +91 7013631730</p>
        <p><strong>📧 Email:</strong> <a href="mailto:kota.jagadesh123@gmail.com">kota.jagadesh123@gmail.com</a></p>
        <p><strong>💻 GitHub:</strong> <a href="https://github.com/Jagadeesh-18-bot" target="_blank" rel="noopener noreferrer">Jagadeesh-18-bot</a></p>
      </div>
      <button className={styles.button} onClick={goToDashboard}>
        Go to Dashboard
      </button>
    </div>
  );
};
// default export of the Contact component
// This allows it to be imported without curly braces:
// Example: import Contact from './Contact';
export default Contact;
