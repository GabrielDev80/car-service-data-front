import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegistrationForm from "./pages/RegistrationFormPage";
import Dashboard from "./pages/Dashboard";
import UpdateUser from "./pages/UpdateUser";
import VehicleDetail from "./pages/VehicleDetail";
import VehicleForm from "./components/forms/VehicleForm";
import VehicleDocumentationForm from "./components/forms/VehicleDocumentationForm";
import VehicleServiceForm from "./components/forms/VehicleServiceForm";
// import CurrentRoute from "./routes/CurrentRoute";

/* 
* *** RUTAS DE LA APP ***

* "/"                  -> HomePage (Pantalla de inicio / login)
* "/register"          -> RegistrationForm (Registro de usuario)
* "/dashboard"         -> Dashboard (Resumen usuario + vehículos)
* "/updateUser"        -> UpdateUser (Editar perfil de usuario)
* "/vehicleForm"       -> VehicleForm (Alta de vehículo)
* "/vehicleDetail/:id" -> VehicleDetail (Detalle de vehículo por ID)
* "/vehicleDocsForm"   -> VehicleDocumentationForm (Agregar docs)
* "/newService"        -> VehicleServiceForm (Agregar servicio)

*/

const App = () => {
  return (
    <BrowserRouter>
      {/* <CurrentRoute /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/updateUser" element={<UpdateUser />} />
        <Route path="/vehicleForm" element={<VehicleForm />} />
        <Route path="/vehicleDetail/:id" element={<VehicleDetail />} />
        <Route path="/vehicleDocsForm" element={<VehicleDocumentationForm />} />
        <Route path="/newService" element={<VehicleServiceForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
