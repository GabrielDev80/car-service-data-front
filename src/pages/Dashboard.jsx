import "../styles/dashboard.css";
import api from "../services/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate.utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error(
            "No se encontro el id del usuario en el localStorage"
          );
        }
        const response = await api.get(`/users/${userId}`);
        console.log("response.data.payload: ", response.data.payload);
        setCurrentUser(response.data.payload);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(response.data.payload)
        );
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateUser = () => {
    navigate("/updateUser");
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!currentUser) {
    return <p>Cargando datos del usuario...</p>;
  }
  // console.log("currentUser: ", currentUser);
  return (
    <>
      <div className="container">
        <div className="row dashboard">
          <div className="col-12 text-center title">
            <h1>Dashboard</h1>
          </div>
          <h2 className="title-section">Usuario</h2>
          <div className="col-12 text-start user">
            <div className="user-image">
              {currentUser.thumbnail ? (
                <>
                  <img
                    src={
                      currentUser.thumbnail.startsWith("data:")
                        ? currentUser.thumbnail
                        : `data:image/jpeg;base64,${currentUser.thumbnail}`
                    }
                    alt="Imagen de usuario"
                    style={{ maxWidth: 200, maxHeight: 200 }}
                  />
                </>
              ) : (
                <span>Sin imagen</span>
              )}
            </div>
            <div className="user-info">
              <p>
                <span>User Id:</span>
                {currentUser.user_id}
              </p>
              <p>
                <span>Alias:</span>
                {currentUser.username}
              </p>
              {currentUser.role === "admin" && <p>Rol: {currentUser.role}</p>}
              <p>
                <span>Nombre y Apellido:</span>
                {currentUser.first_name} {currentUser.last_name}
              </p>
              <p>
                <span>Email:</span>
                {currentUser.email}
              </p>
              <p>
                <span>Teléfono:</span>
                {currentUser.phone}
              </p>
              <p>
                <span>Fecha de creación:</span>
                {formatDate(currentUser.created_at)}
              </p>
              <p>
                <span>Ultima modificación:</span>
                {formatDate(currentUser.updated_at)}
              </p>
              <div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleUpdateUser}
                >
                  Modificar datos
                </button>
              </div>
            </div>
          </div>
          <div className="user-cars">
            <h2 className="title-section">Mis Vehículos</h2>
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={() => navigate("/vehicleForm")}
            >
              Ingresar nuevo vehículo
            </button>
            <p>
              <em>
                Para ver en datalle un vehículo en particular haga clic sobre el
                mismo.
              </em>
            </p>
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Color</th>
                  <th>Patente</th>
                </tr>
              </thead>
              <tbody>
                {currentUser.vehicles.map((vehicle) => (
                  <tr
                    key={vehicle._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      localStorage.setItem("vehicleId", vehicle._id);
                      navigate(`/vehicleDetail/${vehicle._id}`);
                    }}
                  >
                    <td>{vehicle.make}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.color}</td>
                    <td>{vehicle.vehicle_registration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
