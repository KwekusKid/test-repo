import React from 'react';
import { BsLayoutSidebar } from "react-icons/bs";
import './App.css'
import Navbar from './components/Navbar'
import { useState, useEffect, useRef, useCallback } from 'react'
import Home from './pages/home'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import About from './pages/about'

import SimulationOverview from './pages/simulationOverview'
import SimulationDetailed from './pages/simulationDetailed'
import FinancialProfile from './pages/financialProfile'
import SignIn from './pages/signIn'
import CreateAccount from './pages/createAccount'
import FinancialJournal from "./pages/financialJournal";
import FixedCosts from "./pages/fixedCosts";
import DebtPage from "./pages/debtPage";
import TrackDetails from "./pages/trackDetails";
import StrategyOverview from './pages/strategyOverview';

const RouteWatcher = ({ onRouteChange }) => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onRouteChange();
  }, [location, onRouteChange]);

  return null;
};

function App() {
  const [showNav, setShowNav] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');

  useEffect(() => {
    const syncUsername = () => {
      setUsername(localStorage.getItem('username') || '');
    };
    window.addEventListener('storage', syncUsername);
    const interval = setInterval(syncUsername, 500);
    return () => {
      window.removeEventListener('storage', syncUsername);
      clearInterval(interval);
    };
  }, []);

  const closeNav = useCallback(() => {
    setShowNav(false);
  }, []);

  const toggleNav = () => {
    setShowNav(prev => !prev);
  };

  const avatarLetter = username ? username.charAt(0).toUpperCase() : null;

  return (
    <>
      <Router>
        <RouteWatcher onRouteChange={closeNav} />
        <header>
          {username && (
            <button className="menu-toggle" onClick={toggleNav} aria-label="Toggle menu">
              <BsLayoutSidebar />
            </button>
          )}

          {username && (
            <div className="header-user">
              <span className="header-username">{username}</span>
              <div className="header-avatar">{avatarLetter}</div>
            </div>
          )}
        </header>

        <Navbar show={showNav && !!username} onClose={closeNav} />

        <main className={`page-content ${showNav ? 'nav-open' : ''}`}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/financialProfile" element={<FinancialProfile />} />
            <Route path="/simulationOverview" element={<SimulationOverview />} />
            <Route path="/simulation/:simulationId" element={<SimulationDetailed />} />
            <Route path="/strategyOverview" element={<StrategyOverview />} />
            <Route path="/financialJournal" element={<FinancialJournal showNav={showNav} />} />
            <Route path="/fixedCosts" element={<FixedCosts showNav={showNav} />} />
            <Route path="/debtPage" element={<DebtPage showNav={showNav} />} />
            <Route path="/track/:trackId" element={<TrackDetails />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;