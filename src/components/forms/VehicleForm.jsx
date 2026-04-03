import "../../styles/vehicleForm.css";
import api from "../../services/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderApp from "../../components/HeaderApp";
import Swal from "sweetalert2";

const VehicleForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    vehicle_registration: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");
    const formDataToSend = {
      ...formData,
      user_id: userId,
    };
    try {
      const response = await api.post("/vehicles", formDataToSend);

      console.log("Registro Exitoso: ", response.data);

      // Borrar el formulario luego que un envío exitoso
      setFormData({
        make: "",
        model: "",
        year: "",
        color: "",
        vehicle_registration: "",
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });

      // Redirigir al dashboard para completar la carga de datos
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar el usuario: ", error.response);
    }
  };

  return (
    <>
      <HeaderApp />
      <div className="container-fluid form-container">
        <div className="data">
          <h1 className="title">Nuevo Vehículo</h1>
          <span>Por favor ingrese los datos básicos de su vehículo...</span>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="group">
            <label htmlFor="make" className="form-label">
              Marca
            </label>
            <input
              type="text"
              className="form-control"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="group">
            <label htmlFor="model" className="form-label">
              Modelo
            </label>
            <input
              type="text"
              className="form-control"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="group">
            <label htmlFor="year" className="form-label">
              Año
            </label>
            <input
              type="number"
              className="form-control"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="group">
            <label htmlFor="color" className="form-label">
              Color
            </label>
            <input
              type="text"
              className="form-control"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="group">
            <label htmlFor="vehicle_registration" className="form-label">
              Patente
            </label>
            <input
              type="text"
              className="form-control"
              name="vehicle_registration"
              value={formData.vehicle_registration}
              onChange={handleChange}
              required={true}
            />
          </div>
          <p>
            <em>Todos los campos son obligatorios.</em>
          </p>
          <div className="buttons">
            <button type="submit" className="btn btn-outline-primary button">
              Registrar vehículo
            </button>
            <button
              type="button"
              className="btn btn-outline-danger button"
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VehicleForm;
