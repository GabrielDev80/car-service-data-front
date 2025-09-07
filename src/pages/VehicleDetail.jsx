import api from "../services/axios";
import HeaderApp from "../components/HeaderApp";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { formatDate } from "../utils/formatDate.utils";

const VehicleDetail = () => {
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null); // 'vehicle', 'documentation', 'service'
  const [editData, setEditData] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Traer el vehículo correspondiente al id guardado en el localStorage
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const vehicleId = localStorage.getItem("vehicleId");
        if (!vehicleId) {
          throw new Error(
            "No se encontro el id del vehículo en el localStorage"
          );
        }
        const response = await api.get(`/vehicles/${vehicleId}`);
        // console.log("response: ", response);
        setCurrentVehicle(response.data.payload);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchVehicle();
  }, []);

  // Manejo de errores
  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!currentVehicle) {
    return <p>Cargando datos del vehículo...</p>;
  }

  // Función para manejar el clic en el icono de editar la imagen
  const handleIconCLick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Función para manejar el cambio de imagen
  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
  };

  // Función para guardar la nueva imagen
  const handleImageUpload = async () => {
    if (!selectedImages) return;

    const vehicleId = currentVehicle._id;
    const formData = new FormData();
    selectedImages.forEach((img) => formData.append("thumbnails", img));
    try {
      // Enviar la imagen al servidor
      await api.patch(`/vehicles/${vehicleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Imagen actualizada!",
        text: "La imágen fue modificada.",
        showConfirmButton: false,
        timer: 2500,
      });
      setSelectedImages(null);
      // Refrescar los datos del vehículo
      const response = await api.get(`/vehicles/${vehicleId}`);
      setCurrentVehicle(response.data.payload);
    } catch (err) {
      console.error("Error al subir la imagen: ", err);
      Swal.fire("Error", "No se pudo actualizar la imágen.", "error");
    }
  };

  // Función para manejar el clic en el boton de editar vehicle-info
  const handleEditClick = (section, data = {}) => {
    setEditSection(section);
    setEditData(data);
    setIsEditing(true);
  };

  // Función para manejar el cambio de datos en el formulario
  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Función para manejar el submit del formulario
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const vehicleId = currentVehicle._id;
      const { _id, ...dataToSend } = editData;
      await api.patch(`/vehicles/${vehicleId}`, dataToSend);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "¡Actualizado!",
        text: "Los datos fueron modificados.",
        showConfirmButton: false,
        timer: 2500,
      });
      setIsEditing(false);
      const response = await api.get(`/vehicles/${vehicleId}`);
      setCurrentVehicle(response.data.payload);
    } catch (err) {
      Swal.fire("Error", "Nose pudo actualizar el vehiculo.", "error");
    }
  };

  return (
    <>
      <HeaderApp />
      <div className="container">
        <div className="row vehicle-detail">
          <div className="col-12 text-start vehicle">
            <div>
              <div className="vehicle-image" style={{ position: "relative" }}>
                <h3 className="title-section text-center">
                  Datos del vehículo
                </h3>
                <div
                  className="vehicle-image-container"
                  style={{ position: "relative", display: "inline-block" }}
                >
                  <img
                    src={
                      Array.isArray(currentVehicle.thumbnails) &&
                      currentVehicle.thumbnails.length > 0
                        ? currentVehicle.thumbnails[mainImageIdx].startsWith(
                            "data:"
                          )
                          ? currentVehicle.thumbnails[mainImageIdx]
                          : `data:image/*;base64,${currentVehicle.thumbnails[mainImageIdx]}`
                        : "/default-image.png"
                    }
                    alt="Imágen del vehículo"
                    style={{ maxWidth: "300px", maxHeight: "200px" }}
                  />{" "}
                  {/* ícono para modificar imagen */}
                  <span
                    className="vehicle-image-icon"
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      cursor: "pointer",
                      background: "#fff",
                      borderRadius: "50%",
                      padding: 6,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                    onClick={handleIconCLick}
                    title="Modificar imágen"
                  >
                    <img src="/pencil.svg" alt="ícono de editar" />
                  </span>
                  {/* input oculto para modificar imagen */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                    multiple
                  />
                </div>
                {selectedImages && selectedImages.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <span>Imágen/es seleccionada/s:</span>
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      {selectedImages.map((img, idx) => (
                        <li
                          key={idx}
                          style={{ display: "inline-block", marginRight: 10 }}
                        >
                          <img
                            src={URL.createObjectURL(img)}
                            alt={img.name}
                            style={{
                              maxWidth: 80,
                              maxHeight: 80,
                              display: "block",
                              marginBottom: 4,
                            }}
                          />
                          <span style={{ fontSize: 12 }}>{img.name}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Boton para subir la imagen */}
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginLeft: 10 }}
                      onClick={handleImageUpload}
                      type="button"
                    >
                      Guardar imágen
                    </button>
                  </div>
                )}
              </div>

              <div className="vehicle-info">
                <form onSubmit={handleEditSubmit}>
                  <p>
                    <span>Vehicle Id:</span>
                    {currentVehicle._id}
                  </p>
                  <div>
                    <span>Imágenes:</span>
                    {currentVehicle.thumbnails?.length > 0 ? (
                      <div>
                        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                          {currentVehicle.thumbnails.map((img, idx) => (
                            <li
                              key={idx}
                              style={{
                                display: "inline-block",
                                marginRight: 10,
                                border:
                                  idx === mainImageIdx
                                    ? "2px solid #007bff"
                                    : "2px solid transparent",
                                borderRadius: 4,
                                cursor: "pointer",
                              }}
                              onClick={() => setMainImageIdx(idx)}
                              title="Seleccionar como principal"
                            >
                              <img
                                src={
                                  img.startsWith("data:")
                                    ? img
                                    : `data:image/*;base64,${img}`
                                }
                                alt={`Miniatura ${idx + 1}`}
                                style={{
                                  maxWidth: "100px",
                                  maxHeight: "100px",
                                  display: "block",
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                        <span style={{ fontSize: 14, color: "#007bff" }}>
                          Hacé clic en una imagen para mostrarla como principal
                        </span>
                      </div>
                    ) : (
                      <p>No hay imágenes disponibles</p>
                    )}{" "}
                  </div>
                  <p>
                    <span>Marca:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="make"
                        value={editData.make}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{
                          display: "inline-block",
                          width: "auto",
                          marginLeft: 8,
                        }}
                      />
                    ) : (
                      currentVehicle.make
                    )}
                  </p>
                  <p>
                    <span>Modelo:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="model"
                        value={editData.model}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{
                          display: "inline-block",
                          width: "auto",
                          marginLeft: 8,
                        }}
                      />
                    ) : (
                      currentVehicle.model
                    )}
                  </p>
                  <p>
                    <span>Año:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="year"
                        value={editData.year}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{
                          display: "inline-block",
                          width: "auto",
                          marginLeft: 8,
                        }}
                      />
                    ) : (
                      currentVehicle.year
                    )}
                  </p>
                  <p>
                    <span>Color:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="color"
                        value={editData.color}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{
                          display: "inline-block",
                          width: "auto",
                          marginLeft: 8,
                        }}
                      />
                    ) : (
                      currentVehicle.color
                    )}
                  </p>
                  <p>
                    <span>Patente:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="vehicle_registration"
                        value={editData.vehicle_registration}
                        onChange={handleInputChange}
                        className="form-control"
                        style={{
                          display: "inline-block",
                          width: "auto",
                          marginLeft: 8,
                        }}
                      />
                    ) : (
                      currentVehicle.vehicle_registration
                    )}
                  </p>
                  <p>
                    <span>Fecha de creación:</span>
                    {formatDate(currentVehicle.createdAt)}
                  </p>
                  <p>
                    <span>Última modificación:</span>
                    {formatDate(currentVehicle.updatedAt)}
                  </p>
                  {isEditing && (
                    <button className="btn btn-outline-primary" type="submit">
                      Guardar cambios
                    </button>
                  )}
                </form>
                {!isEditing && (
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={() =>
                      handleEditClick("vehicle", {
                        make: currentVehicle.make,
                        model: currentVehicle.model,
                        year: currentVehicle.year,
                        color: currentVehicle.color,
                        vehicle_registration:
                          currentVehicle.vehicle_registration,
                      })
                    }
                  >
                    Modificar datos
                  </button>
                )}
                <button
                  className="btn btn-outline-primary ms-3"
                  type="button"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              </div>
            </div>
            <h3 className="title-section">Documentación</h3>
            {/* ********************************************************* */}
            <p style={{ color: "red" }}>
              <strong>
                *** Falta poder modificar: SECCIÓN DOCUMENTACIÓN Y SECCIÓN
                SERVICIOS ***
              </strong>
              (quitar este párrafo)
            </p>
            {/* ********************************************************* */}
            <p>
              <em>
                Para modificar un documento en particular haga clic sobre el
                mismo.
              </em>
            </p>
            <div className="vehicle-documentation">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>TIPO</th>
                    <th>DETALLE</th>
                    <th>VENCIMIENTO</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVehicle.documentation.map((document) => (
                    <tr
                      key={document._id}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        localStorage.setItem(
                          "docToEdit",
                          JSON.stringify(document)
                        );
                        navigate("/vehicleDocsForm");
                      }}
                    >
                      <td>{document.document_name}</td>
                      <td>{document.description}</td>
                      <td>{formatDate(document.expiration_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/*=========================================
              * Crear una tabla conlos siguientes campos:
                TIPO || DETALLE  || VENCIMIENTO
              - "licencia_nacional",
              - "licencia_cargas-curso",
              - "licencia_cargas-psicofisico",
              - "seguro",
              - "patente",
              - "revision_tecnica",
              - "ruta",
              - "otro"
              ============================================*/}
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={() => navigate("/vehicleDocsForm")}
              >
                Agregar Documentación
              </button>
            </div>
            <h3 className="title-section">Servicios y Mantenimientos</h3>
            <div className="vehicle-services">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Detalle</th>
                    <th>Kilometraje</th>
                    <th>Costo</th>
                    <th>Lugar</th>
                    <th>Km prox. serv.</th>
                    <th>Fecha prox. serv.</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVehicle.services.map((service) => (
                    <tr
                      key={service._id}
                      style={{ cursor: "pointer" }}
                      // onClick={navigate("/ducumentUpdate")}
                    >
                      <td>{service.service_date}</td>
                      <td>{service.service_type}</td>
                      <td>{service.service_description}</td>
                      <td>{service.service_mileage}</td>
                      <td>{service.service_cost}</td>
                      <td>{service.service_location}</td>
                      <td>{service.next_service_mileage}</td>
                      <td>{service.next_service_date}</td>
                    </tr>
                  ))}
                </tbody>
                {/*=========================================
              - Cambios de aceite
              - Reparaciones
              - Bateria
              - Cubiertas
              - Etc
              ============================================*/}
              </table>
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={() => navigate("/newService")}
              >
                Agregar Mantenimiento
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetail;
