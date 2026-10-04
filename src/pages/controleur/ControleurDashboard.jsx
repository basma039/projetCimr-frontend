import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

function ControleurDashboard() {
    return (
    <>
      <Navbar/>
        <section className="agent-content">
        <Outlet />
      </section>
    </> );
}

export default ControleurDashboard;