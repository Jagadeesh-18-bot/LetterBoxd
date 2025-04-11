import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Register.module.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    // normally we , save the user data here...
    router.push('/dashboard'); // redirects to dashbord after register
  };

  return (
    <div className={styles.fullPage}>
      <div className={styles.registerContainer}>
        <div className={styles.logoContainer}>
          <Image src="/Register.png" alt="Register Logo" width={100} height={100} />
        </div>
        <h2>Create an Account</h2>
        <form className={styles.form} onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="text" placeholder="Username" required />

          <div className={styles.passwordField}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
            />
            <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <div className={styles.passwordField}>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
            />
            <span className={styles.eyeIcon} onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? '🙈' : '👁️'}
            </span>
          </div>

          <button type="submit">Register</button>
          <p className={styles.loginPrompt}>
            Already have an account? <a href="/Login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
