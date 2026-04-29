import api from "../services/axios";

import "../styles/updateUser.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { formatDateDDMMYYYY } from "../utils/formats.utils";
import { hasAnyData } from "../utils/conditionals.utils";

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

    // Manejo de campos anidados en 'linti'
    if (name.startsWith("linti.")) {
      const fieldName = name.replace("linti.", "");
      setCurrentUser((prev) => ({
        ...prev,
        linti: {
          ...prev.linti,
          [fieldName]: value,
        },
      }));
      // Manejo de campos anidados en 'lisence'
    } else if (name.startsWith("license.")) {
      const fieldName = name.replace("license.", "");
      setCurrentUser((prev) => ({
        ...prev,
        license: {
          ...prev.license,
          [fieldName]: value,
        },
      }));
      // Manejo de campos planos
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      if (currentUser.license.licenseClass) {
        formData.append(
          "license.licenseClass",
          currentUser.license.licenseClass,
        );
      }
      if (currentUser.license.expireDate) {
        formData.append("license.expireDate", currentUser.license.expireDate);
      }
      if (currentUser.linti) {
        formData.append(
          "linti.psichoPhysicalTest",
          currentUser.linti.psichoPhysicalTest || "",
        );
        formData.append(
          "linti.expPsichoPhysicalTest",
          currentUser.linti.expPsichoPhysicalTest || "",
        );
        formData.append("linti.course", currentUser.linti.course || "");
        formData.append("linti.expCourse", currentUser.linti.expCourse || "");
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

  const expireDateValue = currentUser.license.expireDate
    ? currentUser.license.expireDate.split("T")[0]
    : "";
  const psichoPhysicalTestValue = currentUser.linti?.psichoPhysicalTest
    ? currentUser.linti.psichoPhysicalTest.split("T")[0]
    : "";
  const expPsichoPhysicalTestValue = currentUser.linti?.expPsichoPhysicalTest
    ? currentUser.linti.expPsichoPhysicalTest.split("T")[0]
    : "";
  const courseValue = currentUser.linti?.course
    ? currentUser.linti.course.split("T")[0]
    : "";
  const expCourseValue = currentUser.linti?.expCourse
    ? currentUser.linti.expCourse.split("T")[0]
    : "";

  const thumbnailSrc = thumbnailPreview || currentUser.thumbnail || "";

  return (
    <>
      <div className="updateUser-container">
        <div className="row updateUser">
          <div className="col-12 text-center title">
            <h1 className="updateUser-title">Datos del Usuario</h1>
          </div>
          {isEditing ? (
            /* Modo edición */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="inputs">
                {/* Imágen del usuario */}
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
                {/* Datos del usuario */}
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
                <div className="licenses">
                  <h5>Licencia de conducir</h5>
                  <label htmlFor="licenseClass">Clase:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="licenseClass"
                    name="license.licenseClass"
                    value={currentUser.license.licenseClass ?? ""}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="expireDate">Vencimiento:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="expireDate"
                    name="license.expireDate"
                    value={expireDateValue}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Licencia */}
                <div className="licenses">
                  <h5>Licencia Linti</h5>
                  <label htmlFor="psichoDate">Psicofísico:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="psichoDate"
                    name="linti.psichoPhysicalTest"
                    value={psichoPhysicalTestValue}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="expPsicho">Expiración:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="expPsicho"
                    name="linti.expPsichoPhysicalTest"
                    value={expPsichoPhysicalTestValue}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="courseDate">Curso:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="courseDate"
                    name="linti.course"
                    value={courseValue}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="expCourse">Expiración:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="expCourse"
                    name="linti.expCourse"
                    value={expCourseValue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/* Botones de acción */}
              <div className="form-buttons">
                <button
                  type="submit"
                  className="btn btn-outline-primary btn-lg"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            /* Modo visualización */
            <>
              <div className="col-12 text-start user">
                {/* Imágen del usuario */}
                <div className="user-image">
                  <img
                    src={
                      currentUser.thumbnail?.startsWith("data:")
                        ? currentUser.thumbnail
                        : `data:image/jpeg;base64,${currentUser.thumbnail}`
                    }
                    alt="Imagen de usuario"
                    // style={{ width: "100px", height: "100px" }}
                  />
                </div>
                {/* Datos del usuario */}
                <div className="user-info">
                  <div className="user-data">
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
                  <div className="license">
                    {hasAnyData(currentUser.license) ? (
                      <>
                        <h5>Licencia de conducir</h5>
                        <p>
                          <span>Clase:</span>
                          {currentUser.license.licenseClass ||
                            "No especificada "}
                        </p>
                        <p>
                          <span>Vencimiento:</span>
                          {currentUser.license.expireDate
                            ? formatDateDDMMYYYY(currentUser.license.expireDate)
                            : "No especificado"}
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>
                {/* Licencia */}
                <div className="license">
                  {hasAnyData(currentUser.linti) ? (
                    <>
                      <h5>Licencia Linti</h5>
                      <p>
                        <span>Psicofísico:</span>
                        {currentUser.linti.psichoPhysicalTest
                          ? formatDateDDMMYYYY(
                              currentUser.linti.psichoPhysicalTest,
                            )
                          : "No especificado"}
                      </p>
                      <p>
                        <span>Vencimiento:</span>
                        {currentUser.linti.expPsichoPhysicalTest
                          ? formatDateDDMMYYYY(
                              currentUser.linti.expPsichoPhysicalTest,
                            )
                          : "No especificado"}
                      </p>
                      <p>
                        <span>Curso:</span>
                        {currentUser.linti.course
                          ? formatDateDDMMYYYY(currentUser.linti.course)
                          : "No especificado"}
                      </p>
                      <p>
                        <span>Vencimiento:</span>
                        {currentUser.linti.expCourse
                          ? formatDateDDMMYYYY(currentUser.linti.expCourse)
                          : "No especificado"}
                      </p>
                    </>
                  ) : null}
                </div>
                {/* Botones de acción */}
                <div className="buttons">
                  <button
                    className="btn btn-outline-primary btn-lg"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar datos
                  </button>
                  <button
                    className="btn btn-outline-success btn-lg"
                    onClick={returnToDashboard}
                  >
                    Regresar al Dashboard
                  </button>
                  <button
                    className="btn btn-outline-danger btn-lg"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
