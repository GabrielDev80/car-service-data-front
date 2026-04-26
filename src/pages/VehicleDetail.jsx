import "../styles/vehicleDetail.css";
import api from "../services/axios";
import HeaderApp from "../components/HeaderApp";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  formatDate,
  formatCurrency,
  capitalizeFirstLetter,
} from "../utils/formats.utils";
import { Button } from "../components/Button";

const VehicleDetail = () => {
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [editSection, setEditSection] = useState(null); // 'vehicle', 'documentation', 'service'
  const [editData, setEditData] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { id: vehicleId } = useParams();

  // Traer el vehículo correspondiente al id guardado en el localStorage
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        if (!vehicleId) {
          throw new Error("No se encontro el id del vehículo en la URL");
        }
        const response = await api.get(`/vehicles/${vehicleId}`);
        // console.log("response: ", response);
        setCurrentVehicle(response.data.payload);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchVehicle();
  }, [vehicleId]);

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

  // Función para eliminar un documento
  const handleDeleteDocument = async (event, documentId) => {
    event.stopPropagation(); // Evitar que se dispare el click de la fila

    const result = await Swal.fire({
      title: "¿Eliminar este documento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const updateDocs = currentVehicle.documentation.filter(
        (doc) => doc._id !== documentId,
      );

      await api.patch(`/vehicles/${currentVehicle._id}`, {
        documentation: updateDocs,
      });

      setCurrentVehicle({ ...currentVehicle, documentation: updateDocs });

      Swal.fire("Eliminado", "El documento fue eliminado", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el documento", error);
    }
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
      Swal.fire("Error", "No se pudo actualizar el vehiculo.", err);
    }
  };

  return (
    <>
      <HeaderApp />
      <div className="container-fluid">
        <div className="vehicle-detail-sections">
          {/* Datos del vehículo */}
          <div className="vehicle-detail">
            <h3 className="title-section text-center">Datos del vehículo</h3>

            {/* Imagen del vehículo */}
            <div className="vehicle-image-container">
              <div className="vehicle-image">
                <img
                  src={
                    Array.isArray(currentVehicle.thumbnails) &&
                    currentVehicle.thumbnails.length > 0
                      ? currentVehicle.thumbnails[mainImageIdx].startsWith(
                          "data:",
                        )
                        ? currentVehicle.thumbnails[mainImageIdx]
                        : `data:image/*;base64,${currentVehicle.thumbnails[mainImageIdx]}`
                      : "/default-image.png"
                  }
                  alt="Imágen del vehículo"
                />{" "}
                {/* ícono para modificar imagen */}
                <span
                  className="vehicle-image-icon"
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
                  <Button
                    className="btn-sm"
                    color="btn-primary"
                    onClick={handleImageUpload}
                    style={{ marginLeft: 10 }}
                    text={"Guardar imágen"}
                  />
                </div>
              )}
            </div>

            {/* Información básica del vehículo */}
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
                      <ul>
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
                      <span className="span">
                        Hacé clic en una imagen para mostrarla como principal
                      </span>
                    </div>
                  ) : (
                    <p>No hay imágenes disponibles</p>
                  )}{" "}
                </div>
                <div className="inputs">
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
                </div>
                <div className="info-date">
                  <p>
                    <span>Fecha de creación:</span>
                    {formatDate(currentVehicle.createdAt)}
                  </p>
                  <p>
                    <span>Última modificación:</span>
                    {formatDate(currentVehicle.updatedAt)}
                  </p>
                </div>

                <div className="form-buttons">
                  {isEditing && (
                    <Button
                      color="btn-outline-primary"
                      type="submit"
                      text={"Guardar cambios"}
                    />
                  )}
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
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Documentación del vehículo */}
          <h3 className="title-section">Documentación</h3>
          <div className="vehicle-documentation">
            <p>
              <em>
                Para modificar un documento en particular haga clic sobre el
                mismo.
              </em>
            </p>
            <div className="table-responsive-wrapper table-documentation">
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
                      className="doc-item"
                      key={document._id}
                      onClick={() => {
                        localStorage.setItem(
                          "docToEdit",
                          JSON.stringify(document),
                        );
                        navigate("/vehicleDocsForm");
                      }}
                    >
                      <td>
                        <p className="table-content">
                          {capitalizeFirstLetter(document.document_name)}
                        </p>
                      </td>
                      <td>
                        <p className="table-content">{document.description}</p>
                      </td>
                      <td className="trash">
                        <p className="table-content">
                          {formatDate(document.expiration_date)}
                        </p>
                        <i
                          className="bi bi-trash text-danger"
                          style={{ cursor: "pointer", fontSize: "1.2rem" }}
                          title="Eliminar documento"
                          onClick={(e) => handleDeleteDocument(e, document._id)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="btn btn-outline-success mb-3 add-button"
              type="button"
              onClick={() => {
                localStorage.removeItem("docToEdit");
                navigate("/vehicleDocsForm");
              }}
            >
              Agregar Documentación
            </button>
          </div>

          {/* Servicios y mantenimientos del vehículo */}
          <h3 className="title-section">Servicios y Mantenimientos</h3>
          <div className="vehicle-services">
            <p>
              <em>
                Para modificar un servicio en particular haga clic sobre el
                mismo.
              </em>
            </p>
            <div className="table-responsive-wrapper table-services">
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
                      onClick={() => {
                        localStorage.setItem(
                          "serviceToEdit",
                          JSON.stringify(service),
                        );
                        navigate("/newService");
                      }}
                    >
                      <td>
                        <p className="table-content">
                          {formatDate(service.service_date)}
                        </p>
                      </td>
                      <td>
                        <p className="table-content">
                          {capitalizeFirstLetter(service.service_type)}
                        </p>
                      </td>
                      <td>
                        <p className="table-content">
                          {service.service_description}
                        </p>
                      </td>
                      <td>
                        <p className="table-content">
                          {service.service_mileage}
                        </p>
                      </td>
                      <td>
                        <p className="table-content">
                          {formatCurrency(service.service_cost)}
                        </p>
                      </td>
                      <td>
                        <p className="table-content">
                          {service.service_location}
                        </p>
                      </td>
                      <td>
                        <p className="table-content">
                          {service.next_service_mileage}
                        </p>
                      </td>
                      <td>
                        <p className="table-content">
                          {formatDate(service.next_service_date)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="btn btn-outline-success mb-3 add-button"
              type="button"
              onClick={() => {
                localStorage.removeItem("docToEdit");
                navigate("/newService");
              }}
            >
              Agregar Mantenimiento
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetail;
