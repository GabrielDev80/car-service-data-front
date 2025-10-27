import "../styles/headerApp.css";
const HeaderApp = () => {
  return (
    <>
      <div className="header-container">
        <div>
          <img
            src="/bxs-car-mechanic-color.svg"
            className="logo"
            alt="Car Service Data logo"
          />
        </div>
        <h1 className="header-title">Car Service Data</h1>
        <h2 className="header-subtitle">Gestión de servicios para vehículos</h2>
      </div>
    </>
  );
};

export default HeaderApp;
