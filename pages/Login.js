import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

const Login = () => {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // normally, validates the login here...
    router.push('/dashboard'); // redirects to the dashboard
  };

  return (
    <div className={styles.fullPage}>
      <div className={styles.loginForm}>
        <img src="/login.png" alt="Logo" className={styles.logo} />
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" className={styles.input} />
          <input type="password" placeholder="Password" className={styles.input} />
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <p className={styles.registerPrompt}>
          Don’t have an account? 
          <a href="/Register" className={styles.registerLink}>Register Here!</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
