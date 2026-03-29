import api from "../services/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { formatDateDDMMYYYY } from "../utils/formatDate.utils";

const UpdateUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
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
            "No se encontro el id del usuario en el localStorage",
          );
        }
        const response = await api.get(`/users/${userId}`);
        // console.log("Data: ", response);
        setCurrentUser(response.data.payload);
        setThumbnailPreview(response.data.payload.thumbnail || null);
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
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
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

      // Construir FormData para soportar archivos (thumbnail)
      const formData = new FormData();
      formData.append("first_name", currentUser.first_name ?? "");
      formData.append("last_name", currentUser.last_name ?? "");
      formData.append("username", currentUser.username ?? "");
      formData.append("phone", currentUser.phone ?? "");
      formData.append("email", currentUser.email ?? "");

      // Mapear licencia a un objeto anidado para que mongoose pueda actualizarlo
      if (currentUser.licenseClass) {
        formData.append("license.licenseClass", currentUser.licenseClass);
      }
      if (currentUser.expireDate) {
        formData.append("license.expireDate", currentUser.expireDate);
      }

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      // Realizar la solicitud PATCH al backend
      const response = await api.patch(`/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

        setCurrentUser(response.data.payload);
        setThumbnailPreview(
          response.data.payload.thumbnail || thumbnailPreview,
        );
        setThumbnailFile(null);
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

  const expireDateValue = currentUser.expireDate
    ? currentUser.expireDate.split("T")[0]
    : "";

  const thumbnailSrc = thumbnailPreview || currentUser.thumbnail || "";

  // console.log("Imagen: ", currentUser.thumbnail);

  return (
    <>
      <h1>Datos del Usuario</h1>
      {isEditing ? (
        /* Modo edición */
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
            {thumbnailSrc && (
              <img
                src={
                  thumbnailSrc.startsWith("data:")
                    ? thumbnailSrc
                    : `data:image/jpeg;base64,${thumbnailSrc}`
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
              value={currentUser.first_name ?? ""}
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
              value={currentUser.last_name ?? ""}
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
              value={currentUser.username ?? ""}
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
              value={currentUser.phone ?? ""}
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
              value={currentUser.email ?? ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h5>Licencia de conducir</h5>
            <label htmlFor="licenseClass">Clase:</label>
            <input
              type="text"
              className="form-control"
              id="licenseClass"
              name="licenseClass"
              value={currentUser.licenseClass ?? ""}
              onChange={handleInputChange}
            />
            <label htmlFor="expireDate">Vencimiento:</label>
            <input
              type="date"
              className="form-control"
              id="expireDate"
              name="expireDate"
              value={expireDateValue}
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
        /* Modo visualización */
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
            <div className="license">
              <h5>Licencia de conducir</h5>
              <p>
                <span>Clase:</span>
                {currentUser.licenseClass || "No especificada "}
              </p>
              <p>
                <span>Vencimiento:</span>
                {currentUser.expireDate
                  ? formatDateDDMMYYYY(currentUser.expireDate)
                  : "No especificado"}
              </p>
            </div>
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
