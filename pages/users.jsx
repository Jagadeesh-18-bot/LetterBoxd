import React, { useState, useEffect } from 'react';
import styles from '../styles/users.module.css';
import { useRouter } from 'next/router';
import defaultAvatar from '../public/user.png'; 

const Users = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      alert('You must be logged in.');
      router.push('/Login');
    } else {
      setUsername(storedUsername);
      fetchUsers();
      fetchFollowing(storedUsername);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const usernames = await res.json();
      const userDetails = await Promise.all(usernames.map(async (user) => {
        const profileRes = await fetch(`http://localhost:5000/api/profile/${user}`);
        const profile = await profileRes.json();
        const watchlistRes = await fetch(`http://localhost:5000/api/watchlist/${user}`);
        const watchlist = await watchlistRes.json();
        const ratingsRes = await fetch(`http://localhost:5000/api/ratings/${user}`);
        const ratings = await ratingsRes.json();
        return { username: user, ...profile, watchlist, ratings };
      }));
      setUsers(userDetails);
    } catch (err) {
      console.error('Fetching users failed:', err);
    }
  };

  const fetchFollowing = async (user) => {
    try {
      const res = await fetch(`http://localhost:5000/api/following/${user}`);
      if (!res.ok) throw new Error(`http error! status: ${res.status}`);
      const data = await res.json();
      setFollowing(new Set(data));
    } catch (err) {
      console.error('Fetching following failed:', err);
    }
  };

  const handleFollow = async (userToFollow) => {
    try {
      const response = await fetch('http://localhost:5000/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower: username, following: userToFollow }),
      });
      if (response.ok) {
        setFollowing((prev) => new Set(prev).add(userToFollow));
        alert(`You are now following ${userToFollow}`);
      } else {
        const result = await response.json();
        console.error(result.error);
        alert('Failed to follow user');
      }
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleUnfollow = async (userToUnfollow) => {
    try {
      const response = await fetch(`http://localhost:5000/api/follow/${username}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ following: userToUnfollow }),
      });
      if (response.ok) {
        setFollowing((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userToUnfollow);
          return newSet;
        });
        alert(`You have unfollowed ${userToUnfollow}`);
      } else {
        const result = await response.json();
        console.error(result.error);
        alert('Failed to unfollow user');
      }
    } catch (err) {
      console.error('Unfollow error:', err);
    }
  };

  return (
    <div className={styles.usersContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>👥 Connect 🎉 with Friends 🤗</h1>
        <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
          ← Back to Dashboard
        </button>
      </header>
      <div className={styles.userGrid}>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.username} className={styles.userCard}>
              <div className={styles.cardHeader}>
                <img src={user.avatar || defaultAvatar} alt={user.username} className={styles.avatar} />
                <h2 className={styles.userName}>{user.name || user.username}</h2>
              </div>
              <div className={styles.cardContent}>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Watchlist:</strong>
                  {user.watchlist.length > 0 ? (
                    <ul className={styles.list}>
                      {user.watchlist.map((movie, index) => (
                        <li key={index}>{movie}</li>
                      ))}
                    </ul>
                  ) : 'None'}
                </p>
                <p><strong>Ratings:</strong>
                  {user.ratings.length > 0 ? (
                    <ul className={styles.list}>
                      {user.ratings.map((rating, index) => (
                        <li key={index}>{`${rating.movieTitle}: ${rating.rating}/5`}</li>
                      ))}
                    </ul>
                  ) : 'None'}
                </p>
                <p><strong>Joined:</strong> {user.joined}</p>
              </div>
              <div className={styles.cardFooter}>
                {following.has(user.username) ? (
                  <button onClick={() => handleUnfollow(user.username)} className={styles.unfollowButton}>
                    Unfollow
                  </button>
                ) : (
                  <button onClick={() => handleFollow(user.username)} className={styles.followButton}>
                    Follow
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noUsers}>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;