import "../styles/homePage.css";
import Dashboard from "./Dashboard";
import LoginPage from "./LoginPage";
function HomePage() {
  const isLoggedIn = !!localStorage.getItem("authToken"); // Verifica si hay un token en el localStorage

  return (
    <>
      <div className="homepage-container">
        {isLoggedIn ? <Dashboard /> : <LoginPage />}
      </div>
    </>
  );
}
export default HomePage;
