import homeIcon from '../assets/images/home.png'
import home from '../pages/home'
import {Link} from 'react-router-dom'
import { RiHome2Line } from "react-icons/ri";
import { FaBook } from "react-icons/fa";

const Navbar = ({ show }) => {
return(
    <div className={show ? 'sidenav active' : 'sidenav'}> {/*if show exists, be active if not be inactive*/}
      <img src={homeIcon} alt="home" className="logo"/>  
    <ul>
        <li>
            <Link to="/"><RiHome2Line />Home</Link>
        </li>
         <li>
            <Link to="/about"><FaBook />About Us</Link>
        </li>
         <li>
            <Link to="/prioritySettings">Priority Settings</Link>
        </li>
         <li>
            <Link to="/simulationOverview">Simulation Overview</Link>
        </li>
         <li>
            <Link to="/strategyOverview">Strategy Overview</Link>
        </li>
    </ul>
    </div>
)
}

export default Navbar