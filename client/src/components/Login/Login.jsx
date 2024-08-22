import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5000/login', { email, password })
      .then((result) => {
        console.log(result);
        if (result.data === 'success') {
          navigate('/todo');
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
        <Link
          to="/register"
          className="btn btn-default border w-100 bg-light rounded-0"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
