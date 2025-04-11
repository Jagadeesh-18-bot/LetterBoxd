import React from 'react';
import styles from '../styles/About.module.css';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

const About = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className={styles.aboutPage}>
      <div className={styles.backButtonWrapper}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Back to Dashboard
        </button>
      </div>

      <div className={styles.container}>
        <h1 className={styles.title}>🎬 About Us</h1>
        <p className={styles.description}>
          Welcome to <strong>Letterboxd Clone</strong> — your personal space to discover, rate, and talk about the movies you love.
        </p>
        <p className={styles.description}>
          We aim to recreate the social movie-sharing experience with a simple and elegant design. From trending films to your personal diary of watched content, we’ve got it all.
        </p>
        <p className={styles.description}>
          Built with ❤️ using React and Next.js by passionate movie lovers.
        </p>

        <div className={styles.teamSection}>
          <h2 className={styles.subtitle}>👨‍💻 Our Team</h2>
          <div className={styles.teamList}>
            <div className={styles.card}>
              <img
                src="https://avatars.githubusercontent.com/u/9919?v=4"
                alt="Jagadeeshwar"
                className={styles.avatar}
              />
              <div className={styles.cardText}>
                <h3>Jagadeesh Kota</h3>
                <p>Developer & Designer</p>
              </div>
            </div>
            <div className={styles.card}>
              <img
                src="https://avatars.githubusercontent.com/u/583231?v=4"
                alt="Contributors"
                className={styles.avatar}
              />
              <div className={styles.cardText}>
                <h3>Open Source Contributors</h3>
                <p>Ideas & Features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
