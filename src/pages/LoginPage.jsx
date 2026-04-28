import "../styles/loginPage.css";
import { Link } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import HeaderApp from "../components/HeaderApp";

const LoginPage = () => {
  return (
    <>
      <HeaderApp />
      <div className="login-layout">
        <p className="mb-3 info">Por favor, inicia sesión para continuar...</p>
        <LoginForm />
        <p className="mt-3 info">
          ¿Aún no tienes cuenta? <Link to="/register">Regístrate aquí.</Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
