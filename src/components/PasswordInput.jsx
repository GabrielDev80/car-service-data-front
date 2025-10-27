import "../styles/passwordInput.css";
import { useState } from "react";

const PasswordInput = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="input-group">
      <input
        type={showPassword ? "text" : "password"}
        className="form-control"
        id="password"
        value={value}
        onChange={onChange}
        placeholder="Ingrese su contraseña"
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
          // style={{ width: "30px", height: "30px" }}
        />
      </span>
    </div>
  );
};

export default PasswordInput;
