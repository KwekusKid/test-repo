import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagesCss/signIn.css';
import ABSALogo from "../images/AbsaLogo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

const handleSubmit = (e) => {
  e.preventDefault();
  if (!email.trim()) {
    setError('Please enter your email address.');
    return;
  }
  navigate('/financialProfile');
};

  return (
    <div className="sign-in-page">
      <div className="sign-in-center">

        {/* Logo */}
        <div className="sign-in-logo">
          <img src={ABSALogo} alt="ABSA" />
        </div>

        {/* App title */}
        <h1 className="sign-in-app-title">NextGen Wealth Studio</h1>

        {/* Card */}
        <div className="sign-in-card">
          <div className="sign-in-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="sign-in-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

         {error && <p className="sign-in-error">{error}</p>}

<button className="sign-in-btn" onClick={handleSubmit}>
  Sign In
</button>
        </div>

        {/* Create account link */}
        <p className="sign-in-create" onClick={() => navigate('/create-account')}>
          Create an account
        </p>

      </div>
    </div>
  );
};

export default SignIn;