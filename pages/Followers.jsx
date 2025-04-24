import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/followers.module.css';

// Component to display the followers of currently loggeddin user
const Followers = () => {
  const router = useRouter();
  const [followers, setFollowers] = useState([]); // state tostore the list of followers
  const [username, setUsername] = useState(''); // state to store the logged in user's name
// runs once when the component loads
  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); // gets username from the local storge
    if (!storedUsername) {
        // if not logged in , then alert and redirect to login
      alert('You must be logged in.');
      router.push('/Login');
    } else {
        // if logged in , then save username to state and fetch followers
      setUsername(storedUsername);
      fetchFollowers(storedUsername);
    }
  }, []);

  // fetches followers of the user from the backend Api
  const fetchFollowers = async (user) => {
    try {
      const res = await fetch(`http://localhost:5000/api/followers/${user}`); // api call
      const data = await res.json(); // converts response to json 
      setFollowers(data); // save followers in state
    } catch (err) {
        // if api call fails then show error and reset followers to empty
      console.error('Fetching followers failed:', err);
      setFollowers([]);
    }
  };
// renders the followers Ui
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
// exporting the Followers component so that ,it can be used in other files
export default Followers;