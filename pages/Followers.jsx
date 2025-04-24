import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/followers.module.css';

const Followers = () => {
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      alert('You must be logged in.');
      router.push('/Login');
    } else {
      setUsername(storedUsername);
      fetchFollowers(storedUsername);
    }
  }, []);

  const fetchFollowers = async (user) => {
    try {
      const res = await fetch(`http://localhost:5000/api/followers/${user}`);
      const data = await res.json();
      setFollowers(data);
    } catch (err) {
      console.error('Fetching followers failed:', err);
      setFollowers([]);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Followers 👥</h1>
      </header>

      <main className={styles.main}>
        {followers.length === 0 ? (
          <p className={styles.noFollowers}>You have no followers yet.</p>
        ) : (
          <div className={styles.followersList}>
            {followers.map((follower, index) => (
              <div key={index} className={styles.followerCard}>
                <span className={styles.followerName}>{follower}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Followers;