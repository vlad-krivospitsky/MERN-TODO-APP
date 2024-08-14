import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = () => {
    setIsSignUp(true);
  };

  const handleSignIn = () => {
    setIsSignUp(false);
  };

  return (
    <div
      className={`container ${isSignUp ? 'right-panel-active' : ''}`}
      id="container"
    >
      <div className="form-container sign-up-container">
        <form action="#">
          <h1>Регистрация</h1>
          <input type="text" placeholder="Name" />
          <input type="password" placeholder="Password" />
          <button className="register" type="button">
            Зарегистрироваться
          </button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form action="#">
          <h1>Авторизация</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <a href="#">Забыли пароль?</a>
          <button type="button">Вход</button>
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
            <button className="ghost" onClick={handleSignIn}>
              Авторизация
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Привет!</h1>
            <p>
              Введите свои личные данные и начните путешествие вместе с нами
            </p>
            <button className="ghost" onClick={handleSignUp}>
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
