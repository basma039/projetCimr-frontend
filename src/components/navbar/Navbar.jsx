import { Link } from "react-router-dom";
import "./Navbar.css";
import AuthService from "../../services/AuthService";

export default function Navbar() {

  const role = localStorage.getItem("role");

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/src/assets/CIMR.jpg" alt="CIMR" />
        <span>CIMR</span>
      </div>

      <ul className="menu">

        

        {/* Agent de saisie */}
        {role === "AGENT_SAISIE" && (
          <>
          <li>
          <Link to="/agent">Accueil</Link>
        </li>
            <li>
              <Link to="/agent/saisie">Nouvelle demande</Link>
            </li>

            <li className="dropdown">
              <span>validation ou consultation</span>

              <ul className="submenu">
                <li>
                  <Link to="/agent/listedemandes">chercher et valider une demande de liquidation</Link>
                </li>
                <li>
                  <Link to="/agent/demandeAValider">
                    Demandes à valider
                  </Link>
                </li>
              </ul>
            </li>
            <li>
               <button className="btn" onClick={()=>{
                if(AuthService.isAuthenticated()){
                AuthService.logout() }
                }}>
                   <Link to="/">
                   Logout
                </Link>
                </button>
            </li>
          </>
        )}

        {/* Contrôleur */}
        {role === "CONTROLEUR" && (
          <>
          <li>
          <Link to="/controleur">Accueil</Link>
        </li>
          <li className="dropdown">
            <span>Contrôle </span>

            <ul className="submenu">
              <li>
                <Link to="/controleur/recherche">Rechercher une demande</Link>
              </li>
              <li>
                <Link to="/controleur/demandes-a-controler"> Demandes à contrôler </Link>
              </li>
            </ul>
          </li>
          <li>
        <button className="btn" onClick={()=>{AuthService.logout()}}>
                   <Link to="/">
                   Logout
                </Link>
                </button>
          </li>
           
          </>
          
        )}


      </ul>

    </nav>
  );
}