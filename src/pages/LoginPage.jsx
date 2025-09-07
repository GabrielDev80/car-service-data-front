import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import HeaderApp from "../components/HeaderApp";

const LoginPage = () => {
  return (
    <>
      <HeaderApp />
      <div>
        <p>Por favor, inicia sesión para continuar...</p>
        <LoginForm />
        <p>
          ¿Aún no tienes cuenta? <Link to="/register">Regístrate aquí.</Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
