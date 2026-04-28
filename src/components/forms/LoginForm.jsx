import "../../styles/loginForm.css";

import { useState } from "react";
import api from "../../services/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button";
import { timeString } from "../../utils/formats.utils";

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

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      console.log("TOKEN activado a la hora: ", timeString);
      // Guardar el token en el local storage
      localStorage.setItem("token", response.data.payload.token);
      localStorage.setItem("userId", response.data.payload.user.user_id);
      localStorage.setItem("activate", timeString);

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
    <div className="container container-login">
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                className="form-control mb-2 email-input-group"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingrese su email"
                autoComplete="emai"
                title="Introduce tu email"
                required
              />
            </div>
            {/* Password */}
            <div className="input-group password-input-group">
              <input
                className="form-control password-input"
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
                title="Introduce tu contraseña"
                required
              />
              <span
                className="input-group-text"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                <img
                  className="input-image-eye"
                  src={showPassword ? "/eye-slash-fill.svg" : "/eye-fill.svg"}
                  alt="Toggle Password Visibility"
                />
              </span>
            </div>
            <p className="my-3 required">Ambos campos son obligatorios.</p>
            {/* Submit Button */}
            <Button
              type="submit"
              text="Iniciar Sesión"
              className="btn btn-primary buttons"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
