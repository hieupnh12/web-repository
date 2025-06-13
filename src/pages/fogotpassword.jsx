import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendEmail = (e) => {
    e.preventDefault();

    if (!email) {
      alert('Please enter your email!');
      return;
    }

    // Giả lập gửi email
    setSent(true);
    alert(`✅ Mật khẩu mới đã được gửi đến ${email}`);
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-illustration">
        {/* Nếu muốn thêm ảnh minh họa */}
        {/* <img src="/logo.png" alt="Forgot Illustration" /> */}
      </div>

      <div className="login-form">
        <div className="form-box">
          <h2 className="form-title">Forgot Password</h2>

          {!sent ? (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <label className="form-label">Enter your registered email</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-primary mt-2">
                Send New Password
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-green-600 font-medium">
                ✅ A new password has been sent to <strong>{email}</strong>.
              </p>
              <button onClick={handleBackToLogin} className="btn-primary">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
