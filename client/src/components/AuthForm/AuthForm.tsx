import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';
import { LOCALHOST } from '../../config';

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState < boolean > false;
  const [name, setName] = useState < string > '';
  const [password, setPassword] = useState < string > '';

  const handleSignUp = async (): Promise<void> => {
    try {
      console.log('Sending sign-up request with:', { name, password });
      await axios.post(`${LOCALHOST}/register`, { name, password });
      alert('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed');
    }
  };

  const handleSignIn = async (): Promise<void> => {
    try {
      console.log('Sending sign-in request with:', { name, password });
      const response = await axios.post(`${LOCALHOST}/login`, {
        name,
        password,
      });
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div
      className={`container ${isSignUp ? 'right-panel-active' : ''}`}
      id="container"
    >
      <div className="form-container sign-up-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Регистрация</h1>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="register" type="button" onClick={handleSignUp}>
            Зарегистрироваться
          </button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Авторизация</h1>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => alert('Forgot password?')}>
            Забыли пароль?
          </button>
          <button type="button" onClick={handleSignIn}>
            Вход
          </button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Добро пожаловать!</h1>
            <p>
              Чтобы оставаться на связи с нами, пожалуйста, войдите в систему с
              вашей личной информацией
            </p>
            <button className="ghost" onClick={() => setIsSignUp(false)}>
              Авторизация
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Привет!</h1>
            <p>
              Введите свои личные данные и начните путешествие вместе с нами
            </p>
            <button className="ghost" onClick={() => setIsSignUp(true)}>
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
