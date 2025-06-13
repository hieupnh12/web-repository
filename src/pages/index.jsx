import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = () => {
    const { username, password } = credentials;

    if (!username || !password) {
      alert('Please enter complete information!');
      return;
    }

    const defaultAdmin = {
      username: 'admin',
      password: 'admin123'
    };

    if (username === defaultAdmin.username && password === defaultAdmin.password) {
      navigate('/home');
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-page">
      {/* Bên trái: hình ảnh minh họa */}
      <div className="login-illustration">
        {/* Có thể thêm hình ảnh vào đây nếu muốn */}
        {/* <img src="/logo.png" alt="Illustration" /> */}
      </div>

      {/* Bên phải: form đăng nhập */}
      <div className="login-form">
        <div className="form-box">
          <h2 className="form-title">Log in to system</h2>

          <label className="form-label">Account</label>
          <input
            className="form-control"
            placeholder="VD: admin"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />

          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="VD: admin123"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          <a
            href="#"
            className="forgot-password-link"
            onClick={(e) => {
              e.preventDefault();
              handleForgotPassword();
            }}
          >
            Forgot Password?
          </a>

          <button className="btn-primary mt-4" onClick={handleLogin}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
