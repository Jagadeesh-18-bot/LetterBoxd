import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

const Login = () => {
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form[0].value;
    const password = form[1].value;
  
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await res.json();
    if (res.ok) {
      alert(`Welcome back, ${data.username}!`);
      router.push('/dashboard');
    } else {
      alert(data.error);
    }
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
