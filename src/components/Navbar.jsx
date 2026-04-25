import { Link, useNavigate } from 'react-router-dom'
import { FaBook } from "react-icons/fa";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import '../App.css'

const Navbar = ({ show, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/sign-in');
    };

    return (
        <>
            {/* Backdrop — clicking outside closes nav */}
            {show && <div className="nav-backdrop" onClick={onClose} />}

            <div className={show ? 'sidenav active' : 'sidenav'}>
                <button className="nav-close-btn" onClick={onClose} aria-label="Close menu">
                    <IoClose />
                </button>

                <ul>
                    <li><Link to="/home">MoneyShot</Link></li>
                    <li><Link to="/financialJournal">Financial Journal</Link></li>
                    <li><Link to="/debtPage">Debt Page</Link></li>
                    <li><Link to="/fixedCosts">Fixed Costs</Link></li>
                    <li><Link to="/simulationOverview">Simulation Lab</Link></li>
                    <li><Link to="/strategyOverview">Strategy Track Overview</Link></li>

                </ul>

                <button className="nav-logout-btn" onClick={handleLogout}>
                    <RiLogoutBoxLine />
                    Log out
                </button>
            </div>
        </>
    );
};

export default Navbar;