import "../../styles/vehicleForm.css";
import api from "../../services/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderApp from "../../components/HeaderApp";
import Swal from "sweetalert2";

const VehicleServiceForm = () => {
  const navigate = useNavigate();

  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    service_date: "",
    service_type: "",
    service_description: "",
    service_mileage: "",
    service_cost: "",
    service_location: "",
    next_service_mileage: "",
    next_service_date: "",
  });

  useEffect(() => {
    const service = localStorage.getItem("serviceToEdit");
    if (service) {
      const parsed = JSON.parse(service);
      setFormData({
        service_date: parsed.service_date
          ? parsed.service_date.slice(0, 10)
          : "",
        service_type: parsed.service_type || "",
        service_description: parsed.service_description || "",
        service_mileage: parsed.service_mileage || "",
        service_cost: parsed.service_cost || "",
        service_location: parsed.service_location || "",
        next_service_mileage: parsed.next_service_mileage || "",
        next_service_date: parsed.next_service_date
          ? parsed.next_service_date.slice(0, 10)
          : "",
      });
      setEditingService(parsed);
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
      // 1. Traer el vehículo actual para obtener el array de servicios
      const { data } = await api.get(`/vehicles/${vehicleId}`);
      const currentServices = data.payload.services || [];

      // Convertir fechas a formato ISO
      const formDataToSave = {
        ...formData,
        service_date: formData.service_date
          ? new Date(formData.service_date).toISOString()
          : "",
        next_service_date: formData.next_service_date
          ? new Date(formData.next_service_date).toISOString()
          : "",
      };

      let updatedServices;
      if (editingService && editingService._id) {
        // Editar servicio existente
        updatedServices = currentServices.map((service) =>
          service._id === editingService._id
            ? { ...service, ...formDataToSave, _id: service._id }
            : service,
        );
      } else {
        // Agregar nuevo servicio
        updatedServices = [
          ...currentServices,
          {
            ...formDataToSave,
          },
        ];
      }

      // 2. Enviar el array actualizado
      await api.patch(`/vehicles/${vehicleId}`, { services: updatedServices });

      localStorage.removeItem("serviceToEdit");
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: editingService ? "Servicio modificado" : "Servicio agregado",
        showConfirmButton: false,
        timer: 2000,
      });

      setFormData({
        service_date: "",
        service_type: "",
        service_description: "",
        service_mileage: "",
        service_cost: "",
        service_location: "",
        next_service_mileage: "",
        next_service_date: "",
      });
      navigate(`/vehicleDetail/${vehicleId}`);
    } catch (err) {
      console.error("Error al guardar el servicio:", err);
      Swal.fire("Error", "No se pudo guardar el servicio.", "error");
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("serviceToEdit");
    const vehicleId = localStorage.getItem("vehicleId");
    navigate(`/vehicleDetail/${vehicleId}`);
  };

  return (
    <>
      <HeaderApp />
      <div className="container-fluid form-container">
        <div className="data">
          <h1 className="title">
            {editingService ? "Editar Servicio" : "Agregar Servicio"}
          </h1>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="group">
            <label htmlFor="service_date" className="form-label">
              Fecha de Servicio
            </label>
            <input
              type="date"
              id="service_date"
              name="service_date"
              className="form-control"
              value={formData.service_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="group">
            <label htmlFor="service_type" className="form-label">
              Tipo de Servicio
            </label>
            <select
              id="service_type"
              name="service_type"
              className="form-select"
              value={formData.service_type}
              onChange={handleChange}
              placeholder="Tipo de Servicio"
              required
            >
              {/* <optgroup label="Seleccionar tipo de Servicio"> */}
              <option value="" disabled>
                Seleccionar tipo
              </option>
              <option value="batería">Batería</option>
              <option value="cambio de aceite">Cambio de aceite</option>
              <option value="cambio de correas">Cambio de correas</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="reparación">Reparación</option>
              <option value="cubiertas">Cubiertas</option>
              <option value="otro">Otro</option>
              {/* </optgroup> */}
            </select>
          </div>
          <div className="group">
            <label htmlFor="service_description" className="form-label">
              Descripción del Servicio
            </label>
            <textarea
              id="service_description"
              name="service_description"
              className="form-control"
              value={formData.service_description}
              onChange={handleChange}
              rows="3"
              placeholder="Detalle del servicio realizado"
            />
          </div>
          <div className="group">
            <label htmlFor="service_mileage" className="form-label">
              Kilometraje
            </label>
            <input
              type="number"
              id="service_mileage"
              name="service_mileage"
              className="form-control"
              value={formData.service_mileage}
              onChange={handleChange}
              placeholder="Kilometraje ej: 50000"
            />
          </div>
          <div className="group">
            <label htmlFor="service_cost" className="form-label">
              Costo
            </label>
            <input
              type="number"
              id="service_cost"
              name="service_cost"
              className="form-control"
              value={formData.service_cost}
              onChange={handleChange}
              step="0.01"
              placeholder="Costo ej: 500.00"
            />
          </div>
          <div className="group">
            <label htmlFor="service_location" className="form-label">
              Lugar
            </label>
            <input
              type="text"
              id="service_location"
              name="service_location"
              className="form-control"
              value={formData.service_location}
              onChange={handleChange}
              placeholder="Lugar ej: Taller XYZ"
            />
          </div>
          <div className="group">
            <label htmlFor="next_service_mileage" className="form-label">
              Próximo Servicio - Kilometraje
            </label>
            <input
              type="number"
              id="next_service_mileage"
              name="next_service_mileage"
              className="form-control"
              value={formData.next_service_mileage}
              onChange={handleChange}
              placeholder="Km próximo servicio ej: 60000"
            />
          </div>
          <div className="group">
            <label htmlFor="next_service_date" className="form-label">
              Próximo Servicio - Fecha
            </label>
            <input
              type="date"
              id="next_service_date"
              name="next_service_date"
              className="form-control"
              value={formData.next_service_date}
              onChange={handleChange}
              placeholder="Fecha próximo servicio"
            />
          </div>
          <div className="buttons">
            <button type="submit" className="btn btn-primary button">
              {editingService ? "Actualizar" : "Guardar"}
            </button>
            <button
              className="btn btn-secondary button"
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VehicleServiceForm;
