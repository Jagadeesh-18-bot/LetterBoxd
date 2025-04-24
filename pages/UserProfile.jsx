import React, { useEffect, useState } from 'react';
import styles from '../styles/userprofile.module.css';
import { useRouter } from 'next/router';

const UserProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    avatar: '',
  });

  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;

  useEffect(() => {
    if (!username) return;

    fetch(`http://127.0.0.1:5000/api/profile/${username}`)
      .then(async (res) => {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Invalid response: ${text.substring(0, 100)}`);
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setFormData({
          name: data.name || '',
          location: data.location || '',
          bio: data.bio || '',
          avatar: data.avatar || '',
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load profile');
      });
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    router.push('/Login');
  };

  const handleEditToggle = () => setEditing(!editing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/profile/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      const result = await res.json();
      console.log(result.message);
      setUser((prevUser) => ({ ...prevUser, ...formData }));
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving your profile.');
    }
  };

  if (error) return <div className={styles.profileContainer}>Error: {error}</div>;
  if (!user) return <div className={styles.profileContainer}>Please login to View Your Profile !!</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.card}>
        <div className={styles.avatarSection}>
          <img
            src={formData.avatar || 'https://i.imgur.com/6VBx3io.png'}
            alt="Avatar"
            className={styles.avatar}
          />
        </div>
        

        <div className={styles.infoSection}>
          {editing ? (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Display Name "
                className={styles.inputField}
              />
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter you Location!!"
                className={styles.inputField}
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio Status"
                className={styles.textArea}
              />
              <input
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Avatar URL"
                className={styles.inputField}
              />
            </>
          ) : (
            <>
              <h2>{user.name}</h2>
              <p className={styles.role}>🎬 Movie Lover</p>
              <p className={styles.location}>📍 {user.location}</p>
              <p className={styles.bio}>{user.bio}</p>
            </>
          )}

          <div className={styles.stats}>
            <div>
              <strong>120</strong>
              <span>Watched</span>
            </div>
            <div>
              <strong>78</strong>
              <span>Rated</span>
            </div>
            <div>
              <strong>34</strong>
              <span>Favorites</span>
            </div>
          </div>

          <div className={styles.actions}>
            {editing ? (
              <>
                <button className={styles.editBtn} onClick={handleSave}>
                  Save
                </button>
                <button className={styles.logoutBtn} onClick={handleEditToggle}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className={styles.editBtn} onClick={handleEditToggle}>
                  Edit Profile
                </button>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>

          <p className={styles.joined}>🎉 Joined: {user.joined}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
