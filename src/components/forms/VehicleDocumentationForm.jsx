import "../../styles/vehicleForm.css";
import api from "../../services/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderApp from "../../components/HeaderApp";
import Swal from "sweetalert2";

const VehicleDocumentationForm = () => {
  const navigate = useNavigate();

  const [editingDoc, setEditingDoc] = useState(null);

  const [formData, setFormData] = useState({
    document_name: "",
    description: "",
    expiration_date: "",
  });

  useEffect(() => {
    const doc = localStorage.getItem("docToEdit");
    if (doc) {
      const parsed = JSON.parse(doc);
      setFormData({
        document_name: parsed.document_name || "",
        description: parsed.description || "",
        expiration_date: parsed.expiration_date
          ? parsed.expiration_date.slice(0, 10)
          : "",
      });
      setEditingDoc(parsed);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const vehicleId = localStorage.getItem("vehicleId");
    if (!vehicleId) {
      Swal.fire("Error", "No se encontró el vehículo.", "error");
      return;
    }
    try {
      // 1. Traer el vehículo actual para obtener el array de documentación
      const { data } = await api.get(`/vehicles/${vehicleId}`);
      const currentDocs = data.payload.documentation || [];

      // Siempre guardar expiration_date en formato ISO
      const formDataToSave = {
        ...formData,
        expiration_date: formData.expiration_date
          ? new Date(formData.expiration_date).toISOString()
          : "",
      };

      let updatedDocs;
      if (editingDoc && editingDoc._id) {
        // Editar documentación existente
        updatedDocs = currentDocs.map((doc) =>
          doc._id === editingDoc._id
            ? { ...doc, ...formDataToSave, _id: doc._id }
            : doc,
        );
      } else {
        // Agregar nueva documentación
        updatedDocs = [
          ...currentDocs,
          {
            ...formDataToSave,
          },
        ];
      }

      // 2. Enviar el array actualizado
      await api.patch(`/vehicles/${vehicleId}`, { documentation: updatedDocs });

      localStorage.removeItem("docToEdit");
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: editingDoc
          ? "Documentación modificada"
          : "Documentación agregada",
        showConfirmButton: false,
        timer: 2000,
      });

      setFormData({
        document_name: "",
        description: "",
        expiration_date: "",
      });
      navigate(`/vehicleDetail/${vehicleId}`);
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar la documentación.", err);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("docToEdit");
    const vehicleId = localStorage.getItem("vehicleId");
    navigate(`/vehicleDetail/${vehicleId}`);
  };

  return (
    <>
      <HeaderApp />
      <div className="container-fluid form-container">
        <div className="data">
          <h1 className="title">
            {editingDoc ? "Editar Documentación" : "Agregar Documentación"}
          </h1>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="group">
            <label htmlFor="document_name" className="form-label">
              Tipo de Documento
            </label>
            <select
              className="form-control"
              name="document_name"
              value={formData.document_name}
              onChange={handleChange}
              required={true}
            >
              <option disabled value=""></option>
              <option value="seguro">Seguro</option>
              <option value="patente">Patente</option>
              <option value="revision_tecnica">Revisión Técnica</option>
              <option value="ruta">RUTA</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="group">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="group">
            <label htmlFor="expiration_date" className="form-label">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              className="form-control"
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="buttons">
            <button type="submit" className="btn btn-outline-success button">
              {editingDoc ? "Modificar documentación" : "Agregar documentación"}
            </button>
            <button
              className="btn btn-outline-primary button"
              type="button"
              onClick={handleCancel}
            >
              Atrás
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VehicleDocumentationForm;
