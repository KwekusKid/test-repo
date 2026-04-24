import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagesCss/createAccount.css';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('username', username.trim());
    navigate('/financialProfile');
  };

  return (
    <div className="create-account-page">
      <div className="create-account-center">

        <div className="create-account-logo">
          <div className="logo-placeholder">ABSA</div>
        </div>

        <h1 className="create-account-app-title">NextGen Wealth Studio</h1>

        <div className="create-account-card">
          <h2 className="create-account-heading">Create an account</h2>

          <div className="create-account-form-group">
            <label htmlFor="ca-username">Username</label>
            <input
              id="ca-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g. alex_saves"
              minLength={2}
              maxLength={24}
            />
          </div>

          <div className="create-account-form-group">
            <label htmlFor="ca-email">Email</label>
            <input
              id="ca-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="create-account-form-group">
            <label htmlFor="ca-password">Create a password</label>
            <input
              id="ca-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter a secure password"
            />
          </div>

          <button className="create-account-btn" onClick={handleSubmit}>
            Create Account
          </button>
        </div>

        <p className="create-account-signin" onClick={() => navigate('/sign-in')}>
          Already have an account? Sign in
        </p>

      </div>
    </div>
  );
};

export default CreateAccount;