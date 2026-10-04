
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import AuthService from "../../services/AuthService";
import './AdminDashboard.css';

function AdminDashboard() {

//const f=AuthService.getRole()

return ( 
        <div className="admin-container">
          <Sidebar/>
         {/* CONTENT */}
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
    );
}


export default AdminDashboard;