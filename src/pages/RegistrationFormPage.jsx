import api from "../services/axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import PasswordInput from "../components/passwordInput";
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
      <p>Por favor, registrate para continuar...</p>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  placeholder="Ingrese su nombre"
                  value={formData.first_name}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  placeholder="Ingrese su apellido"
                  value={formData.last_name}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="nickname"
                  placeholder="Ingrese su alias"
                  value={formData.nickname}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="Ingrese su teléfono móvil"
                  value={formData.phone}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Ingrese su email"
                  value={formData.email}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <PasswordInput
                value={formData.password}
                onChange={(e) =>
                  handleChange({
                    target: { id: "password", value: e.target.value },
                  })
                }
                required={true}
              />
              <div className="input-group">
                <input
                  type="file"
                  className="form-control"
                  id="thumbnail"
                  onChange={handleChange}
                />
              </div>
              <p>
                Todos los campos son obligatorios salvo la imágen de perfil.
              </p>
              <button type="submit" className="btn btn-primary">
                Registrarse
              </button>
            </form>
          </div>
        </div>
      </div>
      <p>
        ¿Ya tienes cuenta? <Link to="/">Ve a iniciar sesión.</Link>
      </p>
    </>
  );
};

export default RegistrationForm;
