import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/Register.module.css';

const Register = () => {
  // states to toggle visibility of password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  // function to handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    // extracts form values
    const form = e.target;
    const name = form[0].value;
    const email = form[1].value;
    const username = form[2].value;
    const password = form[3].value;
    const confirmPassword = form[4].value;
  //  checks if password and confirmpassword match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  // sends registration request to backend
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // set content type
      body: JSON.stringify({ name, email, username, password }) // send form data
    });
  
    const data = await res.json(); // parse json response

    // show success or error message based on response
    if (res.ok) {
      alert('Registration successful!');
      router.push('/Login');
    } else {
      alert(data.error);
    }
  };
  
  return (
    <div className={styles.fullPage}>
      <div className={styles.registerContainer}>
        <div className={styles.logoContainer}>
          <Image src="/Register.png" alt="Register Logo" width={100} height={100} />
        </div>
        <h2 className={styles.title}>Create an Account</h2>
        {/* // registration form with input fields */}
        <form className={styles.form} onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="text" placeholder="Username" required />
        {/* // password input with visibility toggle */}
          <div className={styles.passwordField}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
            />
            <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'} {/* // toggle icon */}
            </span>
          </div>

          <div className={styles.passwordField}>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
            />
            <span className={styles.eyeIcon} onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? '🙈' : '👁️'}  {/* // toggle icon */}
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
// exportinng the component as default
export default Register;
