import React, { useState } from 'react';
import './Register.css';
import Header from '../Header/Header';

export default function Register() {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  async function submitRegistration(event) {
    event.preventDefault();
    setMessage('Registration requires a configured server registration endpoint.');
  }
  return <div><Header/><main className="container py-4"><h1>Sign Up</h1>
    <form onSubmit={submitRegistration}>
      <label>Username<input className="form-control" required value={userName} onChange={e=>setUserName(e.target.value)} /></label>
      <label>First Name<input className="form-control" required value={firstName} onChange={e=>setFirstName(e.target.value)} /></label>
      <label>Last Name<input className="form-control" required value={lastName} onChange={e=>setLastName(e.target.value)} /></label>
      <label>Email<input className="form-control" required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label>Password<input className="form-control" required type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
      <button className="btn btn-primary mt-3" type="submit">Register</button>
    </form><p role="status">{message}</p></main></div>;
}
