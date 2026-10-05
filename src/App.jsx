import './App.css'

import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/admin/AdminDashboard'

import ControleurDashboard from './pages/controleur/ControleurDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import UsersList from './pages/admin/users/UserList'
import AddUser from './pages/admin/users/AddUser'
import EditUser from './pages/admin/users/EditUser'
import UserDetails from './pages/admin/users/UserDetails'
import Unauthorized from './pages/Unauthorized'
import DemandeLiquidationForm from './pages/agent/DemandeLiquidationForm'
import RechercherDemandePage from './pages/auth/RechercherDemande'
import ListeDemandesControle from './pages/controleur/ListeDemandesControle'
import ListeDemandesLiquidation from './pages/agent/ListeDemandesLiquidation'
import AccueilAgent from './pages/agent/AccueilAgent'
import ValidationDemande from './pages/agent/ValidationDemande'
import VoirDemandeLiquidation from './pages/agent/VoirDemandeLiquidation'
import Espace from './pages/agent/Espace'
import ControleDemande from './pages/controleur/ControleDemande'
import Statistiques from './pages/admin/Statistiques'
import DemandeAValider from './pages/agent/DemandeAValider'


function App() {
  return (
    
     <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />}/>
              <Route path="/unauthorized" element={<Unauthorized />} />

              
              <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
               <AdminDashboard />
               </ProtectedRoute>
                }>
              <Route path="/admin" element={<Espace />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/users/add" element={<AddUser />} />
              <Route path="/admin/users/edit/:id" element={<EditUser />} />
              <Route path="/admin/users/:id" element={<UserDetails />} />

              <Route path="/admin/dashboard" element={<Statistiques />} />

              </Route>


                

                <Route path="/controleur" element={
                  <ProtectedRoute allowedRoles={["CONTROLEUR"]}>
                    <ControleurDashboard />
                  </ProtectedRoute>
                }>
                <Route path="/controleur" element={<Espace />} />
                <Route path="/controleur/recherche" element={<RechercherDemandePage />} />
                <Route path="/controleur/demandes-a-controler" element={<ListeDemandesControle />} />
                <Route path="/controleur/demandes/:num" element={<ControleDemande />}/>
                </Route>

                <Route path="/agent" element={
                  <ProtectedRoute allowedRoles={["AGENT_SAISIE"]}>
                    <AccueilAgent />
                  </ProtectedRoute>
                }>
                <Route path="/agent/" element={<Espace />} />
                <Route path="/agent/saisie" element={<DemandeLiquidationForm />} />
                <Route path="/agent/demandeAValider" element={<DemandeAValider />} />
                <Route path="/agent/listeDemandes" element={<ListeDemandesLiquidation />} />
                <Route path="/agent/recherche/validation/:num" element={<ValidationDemande />} />
                <Route path="/agent/demandes-liquidation/:num/validation" element={<VoirDemandeLiquidation />} />

                </Route>

            </Routes>

        </BrowserRouter>

  )
}

export default App
/*



*/