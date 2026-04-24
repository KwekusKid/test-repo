import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagesCss/financialProfile.css';

const FinancialProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = username, 2 = financial profile
  const [username, setUsername] = useState('');
  const [income, setIncome] = useState('');
  const [priority, setPriority] = useState('financialFreedom');
  const [horizon, setHorizon] = useState(3);
  const [risk, setRisk] = useState('medium');

  const handleUsernameSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('username', username.trim());
    setStep(2);
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    navigate('/');
  };

  if (step === 1) {
    return (
      <div className="financial-profile-page">
        <div className="financial-profile-card">
          <div className="profile-header">
            <h1>Choose a username</h1>
            <p>Pick a name that will appear across your dashboard throughout the app.</p>
          </div>

          <form className="profile-form" onSubmit={handleUsernameSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. alex_saves"
                required
                minLength={2}
                maxLength={24}
              />
            </div>

            <button type="submit" className="primary-button">
              Continue to Financial Profile →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-profile-page">
      <div className="financial-profile-card">
        <div className="profile-header">
          <h1>Financial Profile</h1>
          <p>Tell us about your finances so we can tailor the experience.</p>
        </div>

        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="income">Monthly income</label>
            <input
              id="income"
              type="number"
              min="0"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="Enter your monthly income"
              required
            />
          </div>

          <div className="form-group">
            <div className="group-header">
              <label htmlFor="priority">Financial priority</label>
              <span className="group-subtitle">What do you want to focus your finances on?</span>
            </div>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="financialFreedom">Financial Freedom</option>
              <option value="wealthGrowth">Wealth Growth</option>
              <option value="peaceOfMind">Peace of Mind</option>
            </select>
          </div>

          <div className="form-group">
            <div className="group-header">
              <label htmlFor="horizon">Time horizon</label>
              <span className="group-subtitle">How long are you planning your finances for?</span>
            </div>
            <div className="slider-row">
              <input
                id="horizon"
                type="range"
                min="1"
                max="5"
                step="1"
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
              />
              <span className="slider-value">{horizon} years</span>
            </div>
          </div>

          <div className="form-group">
            <div className="group-header">
              <label htmlFor="risk">Risk tolerance</label>
              <span className="group-subtitle">Choose your preferred risk level.</span>
            </div>
            <select
              id="risk"
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              required
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button type="submit" className="primary-button">
            Save profile and go to dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinancialProfile;