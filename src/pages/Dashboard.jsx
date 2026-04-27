import "../styles/dashboard.css";
import api from "../services/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formats.utils";
import { Button } from "../components/Button";
import { hasAnyData } from "../utils/conditionals.utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  const licenseWarning = () => {
    const today = new Date();
    const expDate = currentUser.license?.expireDate;
    const timeDiff = new Date(expDate) - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    {
      if (daysDiff > 0 && daysDiff <= 30) {
        return (
          <div className="license-warning">
            <p className="warn">Licencia próxima a vencer!!!</p>
            <p className="warn2">Restan {daysDiff} días</p>
          </div>
        );
      }
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error(
            "No se encontro el id del usuario en el localStorage",
          );
        }
        const response = await api.get(`/users/${userId}`);
        // console.log("response.data.payload: ", response.data.payload);
        setCurrentUser(response.data.payload);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(response.data.payload),
        );
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  // Actualizar los datos del usuario
  const handleUpdateUser = () => {
    navigate("/updateUser");
  };

  // Cerrar sesión de usuario
  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
    } catch (err) {
      console.error("Error al cerrar sesión en el servidor:", err);
    } finally {
      localStorage.removeItem("userId");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("vehicleId");
      localStorage.removeItem("token");

      navigate("/");
    }
  };

  if (error) {
    console.log("Error al cargar el usuario: ", error);
    navigate("/");

    // return <p>Error: {error.message}</p>;
  }

  if (!currentUser) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="row dashboard">
          <div className="col-12 text-center title">
            <h1 className="dashboard-title">Dashboard</h1>
          </div>
          <h2 className="title-section">Usuario</h2>
          <div className="col-12 text-start user">
            <div className="img-uniform">
              {currentUser.thumbnail ? (
                <>
                  <img
                    src={
                      currentUser.thumbnail.startsWith("data:")
                        ? currentUser.thumbnail
                        : `data:image/jpeg;base64,${currentUser.thumbnail}`
                    }
                    alt="Imagen de usuario"
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
              <div className="license">
                {hasAnyData(currentUser.license) ? (
                  <>
                    <h5>Licencia de conducir</h5>
                    <p>
                      <span>Clase:</span>
                      {currentUser.license.licenseClass || "No especificada "}
                    </p>
                    <p>
                      <span>Vencimiento:</span>
                      {currentUser.license.expireDate
                        ? formatDate(currentUser.license.expireDate)
                        : "No especificado"}
                    </p>
                  </>
                ) : null}
                {licenseWarning()}
                {hasAnyData(currentUser.linti) ? (
                  <>
                    <h5>Licencia Linti</h5>
                    <p>
                      <span>Psicofísico:</span>
                      {currentUser.linti.psichoPhysicalTest
                        ? formatDate(currentUser.linti.psichoPhysicalTest)
                        : "No especificado"}
                    </p>
                    <p>
                      <span>Vencimiento:</span>
                      {currentUser.linti.expPsichoPhysicalTest
                        ? formatDate(currentUser.linti.expPsichoPhysicalTest)
                        : "No especificado"}
                    </p>
                    <p>
                      <span>Curso:</span>
                      {currentUser.linti.course
                        ? formatDate(currentUser.linti.course)
                        : "No especificado"}
                    </p>
                    <p>
                      <span>Vencimiento:</span>
                      {currentUser.linti.expCourse
                        ? formatDate(currentUser.linti.expCourse)
                        : "No especificado"}
                    </p>
                  </>
                ) : null}
              </div>
              <p>
                <span>Fecha de creación:</span>
                {formatDate(currentUser.created_at)}
              </p>
              <p>
                <span>Ultima modificación:</span>
                {formatDate(currentUser.updated_at)}
              </p>
              <div className="dashboard-btn">
                <Button
                  color="btn-primary"
                  onClick={handleUpdateUser}
                  text={"Modificar datos"}
                />
                <Button
                  color="btn-danger"
                  onClick={handleLogout}
                  text={"Cerrar sesión"}
                />
              </div>
            </div>
          </div>
          <div className="user-cars">
            <h2 className="title-section">Mis Vehículos</h2>
            <Button
              color="btn-warning mb-2"
              onClick={() => navigate("/vehicleForm")}
              text={"Ingresar nuevo vehículo"}
            />
            <p>
              <em>
                Para ver en datalle un vehículo en particular haga clic sobre el
                mismo.
              </em>
            </p>
            <div className="table-responsive-wrapper">
              <table className=" table-striped table-bordered table-hover table">
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
      </div>
    </>
  );
};

export default Dashboard;
