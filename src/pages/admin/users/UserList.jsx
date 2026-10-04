import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./users.css";
import api from "../../../services/api";
import { getRole } from "../../../services/AuthService";

function UsersList() {


  
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");

    const loadUsers = async () => {

        try {

            const response = await api.get("/admin/users");
            console.log(response);

            setUsers(response.data);
            setFilteredUsers(response.data);

        } catch (e) {

            console.log(e);

        }

    };
    useEffect(() => {
        loadUsers();
        console.log('');
    }, []);

    useEffect(() => {

        let data = [...users];

        if (search !== "") {

            data = data.filter(user =>

                user.username.toLowerCase().includes(search.toLowerCase()) ||

                user.nom.toLowerCase().includes(search.toLowerCase()) ||

                user.prenom.toLowerCase().includes(search.toLowerCase())
                
            );

        }

        if (role !== "") {

            data = data.filter(user => user.role === role);

        }

        setFilteredUsers(data);

    }, [search, role, users]);

  const navigate = useNavigate();

    if(getRole() !== 'ADMIN'){
        return <Navigate to="/unauthorized" replace />;
    }






    const deleteUser = async (id) => {

        if (!window.confirm("Supprimer cet utilisateur ?"))
            return;

        try {

            await api.delete(`/admin/users/${id}`);

            loadUsers();

        } catch (e) {

            console.log(e);

        }

    };



    const toggleStatus = async (id) => {

        try {

            await api.patch(`/admin/users/${id}/status`);

            loadUsers();

        } catch (e) {

            console.log(e);

        }

    };


    return (

        <div className="users-container">

            <div className="users-header">

                <h2>Gestion des utilisateurs</h2>

                <button
                    className="btn-add"
                    onClick={() => navigate("/admin/users/add")}
                >
                    + Ajouter
                </button>

            </div>



            <div className="users-filters">

                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >

                    <option value="">Tous les rôles</option>
                    <option value="AGENT_SAISIE">Agent de saisie</option>
                    <option value="CONTROLEUR">Contrôleur</option>
                    <option value="ADMIN">Administrateur</option>

                </select>

            </div>



            <table className="users-table">

                <thead>

                <tr>

                    <th>Username</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Actions</th>

                </tr>

                </thead>

                <tbody>

                { 

                    filteredUsers.map(user => (

                        <tr key={user.id}>

                            <td>{user.username}</td>

                            <td>{user.nom}</td>

                            <td>{user.prenom}</td>

                            <td>{user.email}</td>

                            <td>{user.role}</td>

                            <td>

                                {

                                    user.actif ?

                                        <span className="active">
                                            Actif
                                        </span>

                                        :

                                        <span className="inactive">
                                            Désactivé
                                        </span>

                                }

                            </td>

                            <td>

                                <button
                                    className="btn-details"
                                    onClick={() =>
                                        navigate(`/admin/users/${user.id}`)
                                    }
                                >
                                    Détails
                                </button>

                                <button
                                    className="btn-edit"
                                    onClick={() =>
                                        navigate(`/admin/users/edit/${user.id}`)
                                    }>
                                    Modifier
                                </button>

                                <button
                                    className="btn-status"
                                    onClick={() =>
                                        toggleStatus(user.id)
                                    }
                                >
                                    {

                                        user.actif ?

                                            "Désactiver"

                                            :

                                            "Activer"

                                    }

                                </button>
                                {user.role !== "ADMIN" && (
                                <button
                                    className="btn-delete"
                                    onClick={() =>
                                        deleteUser(user.id)
                                    }
                                >
                                    Supprimer
                                </button>
                                )}

                            </td>

                        </tr>

                    ))

                }

                </tbody>

            </table>

        </div>

    );
}

export default UsersList;