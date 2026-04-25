import React from 'react';
import { BsLayoutSidebar } from "react-icons/bs";
import './App.css'
import Navbar from './components/Navbar'
import { useState, useEffect, useRef, useCallback } from 'react'
import Home from './pages/home'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

const AppShell = ({ children, username, toggleNav }) => {
  const location = useLocation();
  const authRoutes = ['/', '/sign-in', '/create-account'];
  const isAuthPage = authRoutes.includes(location.pathname);
  const avatarLetter = username ? username.charAt(0).toUpperCase() : null;

  return (
    <>
      {!isAuthPage && username && (
        <header>
          <button className="menu-toggle" onClick={toggleNav} aria-label="Toggle menu">
            <BsLayoutSidebar />
          </button>
          <div className="header-user">
            <span className="header-username">{username}</span>
            <div className="header-avatar">{avatarLetter}</div>
          </div>
        </header>
      )}
      {children}
    </>
  );
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

  return (
    <Router>
      <RouteWatcher onRouteChange={closeNav} />
      <AppShell username={username} toggleNav={toggleNav}>
        <Navbar show={showNav && !!username} onClose={closeNav} />
        <main className={`page-content ${showNav ? 'nav-open' : ''}`}>
          <Routes>
            {/* Default: sign-in first */}
            <Route index element={<SignIn />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/create-account" element={<CreateAccount />} />

            {/* App pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/financialProfile" element={<FinancialProfile />} />
            <Route path="/simulationOverview" element={<SimulationOverview />} />
            <Route path="/simulation/:simulationId" element={<SimulationDetailed />} />
            <Route path="/strategyOverview" element={<StrategyOverview />} />
            <Route path="/financialJournal" element={<FinancialJournal showNav={showNav} />} />
            <Route path="/fixedCosts" element={<FixedCosts showNav={showNav} />} />
            <Route path="/debtPage" element={<DebtPage showNav={showNav} />} />
            <Route path="/track/:trackId" element={<TrackDetails />} />

            {/* Any unknown path goes back to sign-in */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AppShell>
    </Router>
  );
}

export default App;