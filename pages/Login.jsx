import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
// login component definitation
const Login = () => {
  const router = useRouter();
// funnction to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // prevent default form submissionn behaviour
    const form = e.target;
    const email = form[0].value;
    const password = form[1].value;
// sends login req to backend
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // sends json data
      body: JSON.stringify({ email, password }), // converts data to json
    });

    const data = await res.json(); // parse response json
    if (res.ok) {
      // on successful login, store username and then redirect to dashboard
      localStorage.setItem('username', data.username);
      alert(`Welcome back, ${data.username}!`);
      router.push('/dashboard');
    } else {
      // if failure , then show error message from backend
      alert(data.error);
    }
  };

  return (
    <div className={styles.fullPage}>
      <img src="/login.png" alt="Login" className={styles.logo} />
      <h2 className={styles.heading}>Welcome Back</h2>
      <p className={styles.subheading}>Sign in to continue</p>
      <form onSubmit={handleLogin} className={styles.form}>
        <input type="email" placeholder="Email" className={styles.input} required />
        <input type="password" placeholder="Password" className={styles.input} required />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p className={styles.registerPrompt}>
        Don’t have an account?
        <a href="/Register" className={styles.registerLink}>Register Here</a>
      </p>
    </div>
  );
};
// exports the login component as default
export default Login;
