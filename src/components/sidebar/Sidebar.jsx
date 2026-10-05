import { Link } from "react-router-dom";
import AuthService, { getToken, getRole } from "../../services/AuthService";
import './Sidebar.css';
import imageLogo from "../../assets/CIMR.jpg";
import {
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaNewspaper,
  FaEnvelope,
  FaCog
} from "react-icons/fa";

function Sidebar() {
  const user = getToken();
  const role = getRole();

  if (!user || role.toLowerCase() !== "admin") {
    return console.log(role.toLowerCase());
  }

  return (
    <aside className="sidebar">

    <div className="cont">
        <img src={imageLogo} alt="logo" className="logoC" width={'80px'} height={''} />
        <h2>Admin Panel</h2>
        
        <Link to="/admin/dashboard">
          Dashboard Admin
      </Link>
      
      <Link to="/admin/users">
         Users  
      </Link>
      
      
      
      <button onClick={()=>{AuthService.logout()}}>
         <Link to="/">
         Logout
      </Link>
      </button>
     
</div>
     

    </aside>
  );
}

export default Sidebar;