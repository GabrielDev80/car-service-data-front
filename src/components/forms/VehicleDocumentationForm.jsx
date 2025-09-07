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
        // console.log("editingDoc:", editingDoc);
        // console.log("currentDocs:", currentDocs);
        // console.log("formData:", formData);
        // Convierte expiration_date a ISO si está en formato corto
        updatedDocs = currentDocs.map((doc) =>
          doc._id === editingDoc._id
            ? { ...doc, ...formDataToSave, _id: doc._id }
            : doc
        );
      } else {
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
      Swal.fire("Error", "No se pudo guardar la documentación.", "error");
    }
  };
  return (
    <>
      <HeaderApp />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3>Agregar / Modificar Documentación del vehículo</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-2">
                <select
                  className="form-control"
                  name="document_name"
                  value={formData.document_name}
                  onChange={handleChange}
                  required={true}
                >
                  <option>Tipo de Documento</option>
                  <option value="licencia_nacional">Licencia Nacional</option>
                  <option value="licencia_cargas-curso">
                    Licencia Cargas - Curso
                  </option>
                  <option value="licencia_cargas-psicofisico">
                    Licencia Cargas - Psicofísico
                  </option>
                  <option value="seguro">Seguro</option>
                  <option value="patente">Patente</option>
                  <option value="revision_tecnica">Revisión Técnica</option>
                  <option value="ruta">RUTA</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  placeholder="Descripción"
                  value={formData.description}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="input-group mb-2">
                <input
                  type="date"
                  className="form-control"
                  name="expiration_date"
                  placeholder="Fecha de vencimiento"
                  value={formData.expiration_date}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <button type="submit" className="btn btn-outline-success">
                {editingDoc
                  ? "Modificar documentación"
                  : "Agregar documentación"}
              </button>{" "}
              <button
                className="btn btn-outline-primary ms-3"
                type="button"
                onClick={() =>
                  navigate(`/vehicleDetail/${localStorage.getItem("userId")}`)
                }
              >
                Atrás
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDocumentationForm;
