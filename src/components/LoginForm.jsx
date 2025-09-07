import "../styles/loginForm.css";
import { useState } from "react";
import api from "../services/axios";
import PasswordInput from "./passwordInput";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validar que los campos email y password no esten vacíos
    if (!formData.email)
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "El campo email es obligatorio",
      });

    if (!formData.password)
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "El campo password es obligatorio",
      });

    try {
      const response = await api.post("sessions/login", formData);
      console.log("Inicio de sesión exitoso: ", response.data);
      // Guardar el token en el local storage
      localStorage.setItem("token", response.data.payload.token);
      localStorage.setItem("userId", response.data.payload.user.user_id);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });

      // Redirigir al Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
      if (error && error.response) {
        // Si hay un array de errores de validación
        if (Array.isArray(error.response.data.errors)) {
          const mensajes = error.response.data.errors
            .map((err) => err.msg)
            .join("\n");
          return Swal.fire({
            icon: "error",
            title: "Error de validación",
            text: mensajes,
          });
        }
        // Si hay un mensaje simple
        return Swal.fire({
          icon: "error",
          title: error.response.data.status || "Error",
          text: error.response.data.message || "Ocurrió un error",
        });
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingrese su email"
              />
              {/* <span className="input-group-text">@</span> */}
            </div>
            <PasswordInput
              value={formData.password}
              onChange={(e) =>
                handleChange({
                  target: { id: "password", value: e.target.value },
                })
              }
            />
            <p>Ambos campos son obligatorios.</p>

            <button type="submit" className="btn btn-primary">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
