import React from 'react';
import styles from '../styles/userprofile.module.css';
import { useRouter } from 'next/router';

const UserProfile = () => {
  const router = useRouter();

  const user = {
    name: 'Jagadeesh Kota',
    email: 'jagadeesh@example.com',
    role: 'AI & Data Science Student',
    location: 'Andhra Pradesh, India',
    joined: 'January 2025',
    bio: "Aspiring AI enthusiast with a passion for coding, movies, and creative innovation.",
    avatar: 'https://i.imgur.com/6VBx3io.png',
    stats: {
      watched: 120,
      rated: 78,
      favorites: 34,
    },
  };

  const handleLogout = () => {
    // You can add logout logic here (e.g., clearing tokens, session, etc.)
    router.push('/Login'); // Redirect to login page
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.card}>
        <div className={styles.avatarSection}>
          <img src={user.avatar} alt="User Avatar" className={styles.avatar} />
        </div>

        <div className={styles.infoSection}>
          <h2>{user.name}</h2>
          <p className={styles.role}>{user.role}</p>
          <p className={styles.location}>📍 {user.location}</p>
          <p className={styles.bio}>{user.bio}</p>

          <div className={styles.stats}>
            <div>
              <strong>{user.stats.watched}</strong>
              <span>Watched</span>
            </div>
            <div>
              <strong>{user.stats.rated}</strong>
              <span>Rated</span>
            </div>
            <div>
              <strong>{user.stats.favorites}</strong>
              <span>Favorites</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.editBtn}>Edit Profile</button>
            <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>

          <p className={styles.joined}>🎉 Joined: {user.joined}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
