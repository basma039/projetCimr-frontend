

import React from "react";
import "./Espace.css";
import { getNom, getPrenom, getRole, getUsername } from "../../services/AuthService";

const Espace = () => {
  return (
    
    <div className="espace-container">
        {getRole() === "AGENT_SAISIE" && (
      <div className="espace-card">
        <img src="/src/assets/CIMR.jpg" width="150" height="150" alt="CIMR" className="espace-logo" style={{ opacity: 1 }}/>
        <h1 className="espace-title">Bienvenue M.{getNom()} {getPrenom()}</h1>
        <p className="espace-text">
          Vous êtes connecté en tant qu'<strong>{getRole()}</strong>.
          Vous pouvez accéder aux fonctionnalités de saisie et de validation
          des demandes de liquidation. 
        </p>
      </div>
        )}
        {getRole() === "CONTROLEUR" && (
      <div className="espace-card">
        <img src="/src/assets/CIMR.jpg" width="150" height="150" alt="CIMR" className="espace-logo" style={{ opacity: 1 }}/>
        <h1 className="espace-title">Bienvenue <br /> M.{getNom()} {getPrenom()}</h1>
        <p className="espace-text">
          Vous êtes connecté en tant qu'un <strong>{getRole()}</strong>.
          Vous pouvez accéder aux fonctionnalités de contrôle et de validation
          des demandes de liquidation. 
        </p>
      </div>
        )}
        {getRole() === "ADMIN" && (
      <div className="espace-card"> 
        <img src="/src/assets/CIMR.jpg" width="150" height="150" alt="CIMR" className="espace-logo" style={{ opacity: 1 }}/>
        <h1 className="espace-title">Bienvenue M.{getNom()} {getPrenom()}</h1>
        <p className="espace-text">
          Vous êtes connecté en tant que : <strong>{getRole()}</strong>.
          Vous pouvez accéder aux fonctionnalités d'administration du système.
        </p>
      </div>
        )}
    </div>
  );
};

export default Espace;