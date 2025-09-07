import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegistrationForm from "./pages/RegistrationFormPage";
import Dashboard from "./pages/Dashboard";
import UpdateUser from "./pages/UpdateUser";
import VehicleDetail from "./pages/VehicleDetail";
import VehicleForm from "./components/forms/VehicleForm";
import VehicleDocumentationForm from "./components/forms/VehicleDocumentationForm";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/updateUser" element={<UpdateUser />} />
        <Route path="/vehicleForm" element={<VehicleForm />} />
        <Route path="/vehicleDetail/:id" element={<VehicleDetail />} />
        <Route path="/vehicleDocsForm" element={<VehicleDocumentationForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
