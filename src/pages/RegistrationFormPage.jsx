import "../styles/loginPage.css";
import "../styles/loginForm.css";

import api from "../services/axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import HeaderApp from "../components/HeaderApp";
import Swal from "sweetalert2";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    phone: "",
    email: "",
    password: "",
    thumbnail: null,
  });

  const handleChange = (event) => {
    const { id, value, files } = event.target;
    setFormData({
      ...formData,
      [id]: files ? files[0] : value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await api.post("/sessions/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Registro Exitoso: ", response.data);

      // Borrar el formulario luego que un envío exitoso
      setFormData({
        first_name: "",
        last_name: "",
        nickname: "",
        phone: "",
        email: "",
        password: "",
        thumbnail: null,
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });

      // Redirigir a la Home Page para loggear
      navigate("/");
    } catch (error) {
      const errorMessageList = error.response.data.errors;
      const errorMessages = errorMessageList
        .map((error) => `⇨ ${error.msg}`)
        .join("\n");
      console.log(errorMessages);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error al registrar el usuario",
        text: errorMessages,
        showConfirmButton: true,
        // timer: 2500,
      });
      console.error("Error al registrar el usuario: ", error.response);
    }
  };

  return (
    <>
      <HeaderApp />
      <div className="register-layout">
        <p className="mb-3 info">Por favor, registrate para continuar...</p>
        <div className="container container-register">
          <div className="row">
            <div className="col-12">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control item-input-group"
                    id="first_name"
                    placeholder="Ingrese su nombre"
                    title="Ingrese su nombre"
                    value={formData.first_name}
                    onChange={handleChange}
                    autoComplete="name"
                    title="first-name"
                    required={true}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control item-input-group"
                    id="last_name"
                    placeholder="Ingrese su apellido"
                    title="Ingrese su apellido"
                    value={formData.last_name}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required={true}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control item-input-group"
                    id="nickname"
                    placeholder="Ingrese su alias"
                    title="Ingrese su alias"
                    value={formData.nickname}
                    onChange={handleChange}
                    autoComplete="username || nickname"
                    required={true}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="tel"
                    className="form-control item-input-group"
                    id="phone"
                    placeholder="Ingrese su teléfono móvil"
                    title="Ingrese su teléfono móvil"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required={true}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control item-input-group"
                    id="email"
                    placeholder="Ingrese su email"
                    title="Ingrese su email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required={true}
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
                    title="Ingrese su contraseña"
                    autoComplete="new-password"
                    required
                  />
                  <span
                    className="input-group-text"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      className="input-image-eye"
                      src={
                        showPassword ? "/eye-slash-fill.svg" : "/eye-fill.svg"
                      }
                      alt="Toggle Password Visibility"
                    />
                  </span>
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control item-input-group"
                    id="thumbnail"
                    onChange={handleChange}
                  />
                </div>
                <p className="my-3 required">
                  Todos los campos son obligatorios salvo la imágen de perfil.
                </p>
                <button type="submit" className="btn btn-primary buttons">
                  Registrarse
                </button>
              </form>
            </div>
          </div>
        </div>
        <p className="mb-3 info">
          ¿Ya tienes cuenta? <Link to="/">Ve a iniciar sesión.</Link>
        </p>
      </div>
    </>
  );
};

export default RegistrationForm;
