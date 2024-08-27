
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LOCALHOST } from '../../config';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>(''); 
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${LOCALHOST}/login`, { email, password })
      .then((result) => {
        if (result.data.success === true) {
          navigate('/todo');
        } else {
          setMessage(result.data.message); 
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            setMessage('Invalid password. Please try again.');
          } else if (err.response.status === 400 && err.response.data.message === 'Password cannot be empty') {
            setMessage('Email and password cannot be empty.');
          } else if (err.response.status === 400) {
            setMessage('Empty field(s) or no record existed. Please register first.');
          }
        } else {
          setMessage('An unexpected error occurred. Please try again.');
        }
        console.log(err);
      });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary h-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email-input">
              <strong>Email</strong>
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="Enter email"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password-input">
              <strong>Password</strong>
            </label>
            <input
              id="password-input"
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              className="form-control rounded-0"
              onChange={handlePasswordChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            style={{ backgroundColor: '#3f6b8f' }}
          >
            Login
          </button>
        </form>
        {message && <p className="mt-3 text-center text-danger">{message}</p>}
        <Link
          to="/register"
          className="btn btn-default border w-100 bg-light rounded-0 mt-3"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
