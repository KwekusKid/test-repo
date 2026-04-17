import { BsLayoutSidebar } from "react-icons/bs";
import './App.css'
import Navbar from './components/Navbar'
import { useState } from 'react'
import Home from './pages/home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from './pages/about'
import PrioritySettings from './pages/prioritySettings'
import SimulationOverview from './pages/simulationOverview'
import StrategyOverview from './pages/strategyOverview'
import FinancialJournal from "./pages/financialJournal";


function App() {
  const [showNav, setShowNav] = useState(false) //when I click the sidebar icon, change this to true
  return (
    <>
      <Router>
        <header>
          <BsLayoutSidebar onClick={() => setShowNav(!showNav)} />
        </header>
        {/*OnClick, do the opposite of the current value of showNav*/}

        <Navbar show={showNav} /> {/*make showNav a prop that I can customise*/}
        <div className='main'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/prioritySettings" element={<PrioritySettings />} />
            <Route path="/simulationOverview" element={<SimulationOverview />} />
            <Route path="/strategyOverview" element={<StrategyOverview />} />
            <Route path="/financialJournal" element={<FinancialJournal />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
