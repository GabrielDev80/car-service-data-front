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
      <p>Por favor ingrese los datos básicos de su vehículo...</p>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="make"
                  placeholder="Marca"
                  value={formData.make}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="model"
                  placeholder="Modelo"
                  value={formData.model}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  name="year"
                  placeholder="Año"
                  value={formData.year}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="color"
                  placeholder="Color"
                  value={formData.color}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="vehicle_registration"
                  placeholder="Patente"
                  value={formData.vehicle_registration}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <p>
                <em>Todos los campos son obligatorios.</em>
              </p>
              <button type="submit" className="btn btn-primary">
                Registrar vehículo
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleForm;
