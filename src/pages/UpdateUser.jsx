import api from "../services/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UpdateUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        // console.log("userId: ", userId);

        if (!userId) {
          throw new Error(
            "No se encontro el id del usuario en el localStorage"
          );
        }
        const response = await api.get(`/users/${userId}`);
        // console.log("Data: ", response);
        setCurrentUser(response.data.payload);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const returnToDashboard = () => {
    navigate("/dashboard");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentUser((prev) => ({
          ...prev,
          thumbnail: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Obtener el id de usuario del localstorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("No se encontro el id del usuario en el localStorage");
      }

      // Realizar la solicitud PATCH al backend
      const response = await api.patch(`/users/${userId}`, currentUser);

      // Manejar la respuesta del backend
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Datos actualizados!",
          text: "Los datos fueron modificados correctamente.",
          showConfirmButton: false,
          timer: 2500,
        });
        setIsEditing(false); // Salir del modo edición
      } else {
        throw new Error("Error al actualizar los datos del usuario");
      }
    } catch (err) {
      setError(err.message || "Error al actualizar los datos");
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!currentUser) {
    return <p>Cargando datos del usuario...</p>;
  }

  // console.log("Imagen: ", currentUser.thumbnail);

  return (
    <>
      <h1>Datos del Usuario</h1>
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <input
              type="file"
              className="form-control"
              id="thumbnail"
              accept="image/*"
              onChange={handleImageChange}
            />
            {currentUser.thumbnail && (
              <img
                src={
                  currentUser.thumbnail.startsWith("data:")
                    ? currentUser.thumbnail
                    : `data:image/jpeg;base64,${currentUser.thumbnail}`
                }
                alt="Previsualización de la imagen"
                style={{ width: "50px", height: "50px" }}
              />
            )}
          </div>
          <div>
            <label htmlFor="first_name">Nombre:</label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
              value={currentUser.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="last_name">Apellido:</label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
              value={currentUser.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="username">Alias:</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={currentUser.username}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="phone">Teléfono:</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={currentUser.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={currentUser.email}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-outline-primary btn-lg">
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg ms-3"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </button>
        </form>
      ) : (
        <>
          <div>
            <img
              src={
                currentUser.thumbnail?.startsWith("data:")
                  ? currentUser.thumbnail
                  : `data:image/jpeg;base64,${currentUser.thumbnail}`
              }
              alt="Imagen de usuario"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
          <div>
            <p>
              <span>Nombre:</span>
              {currentUser.first_name}
            </p>
            <p>
              <span>Apellido:</span>
              {currentUser.last_name}
            </p>
            <p>
              <span>Alias:</span>
              {currentUser.username}
            </p>
            <p>
              <span>Teléfono:</span>
              {currentUser.phone}
            </p>
            <p>
              <span>Email:</span>
              {currentUser.email}
            </p>
          </div>
          <button
            className="btn btn-outline-primary btn-lg"
            onClick={() => setIsEditing(true)}
          >
            Editar datos
          </button>
        </>
      )}
      {!isEditing && (
        <>
          <div>
            <button
              className="btn btn-outline-success btn-lg"
              onClick={returnToDashboard}
            >
              Regresar al Dashboard
            </button>
          </div>
          <div>
            <button
              className="btn btn-outline-danger btn-lg"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateUser;
