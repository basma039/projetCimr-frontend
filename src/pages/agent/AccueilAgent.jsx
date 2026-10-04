import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

function AccueilAgent() {
    return (
    <>
      <Navbar/>
        <section className="content">
        <Outlet />
      </section>
    </> );
}

export default AccueilAgent;