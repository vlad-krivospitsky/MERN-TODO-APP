import { Link, useNavigate } from 'react-router-dom';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { LOCALHOST } from '../../config';

export default function SignUp() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');  
  const [message, setMessage] = useState<string>(''); 
  const [error, setError] = useState<string>(''); 
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${LOCALHOST}/register`, { name, email, password })
      .then((result) => {
        setMessage(result.data.message);
        setError('');
        setTimeout(() => { navigate('/login') }, 2000);
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.error);
          setMessage('');
        } else {
          setError('An unexpected error occurred. Please try again.');
          setMessage('');
        }
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary h-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter name"
              autoComplete="off"
              name="name"
              className="form-control rounded-0"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password"
              className="form-control rounded-0"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            style={{ backgroundColor: '#3f6b8f' }}
          >
            Register
          </button>
        </form>
        {message && <p className="mt-3 text-center fw-bold text-success">{message}</p>}
        {error && <p className="mt-3 text-center fw-bold text-danger">{error}</p>}
        <Link to="/" className="btn btn-default border w-100 bg-light rounded-0">
          Login
        </Link>
      </div>
    </div>
  );
}
