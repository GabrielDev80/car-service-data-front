const appRoutes = [
  { path: "/", element: "HomePage", description: "Pantalla de inicio / login" },
  {
    path: "/register",
    element: "RegistrationForm",
    description: "Registro de usuario",
  },
  {
    path: "/dashboard",
    element: "Dashboard",
    description: "Resumen usuario + vehículos",
  },
  {
    path: "/updateUser",
    element: "UpdateUser",
    description: "Editar perfil de usuario",
  },
  {
    path: "/vehicleForm",
    element: "VehicleForm",
    description: "Alta de vehículo",
  },
  {
    path: "/vehicleDetail/:id",
    element: "VehicleDetail",
    description: "Detalle de vehículo por ID",
  },
  {
    path: "/vehicleDocsForm",
    element: "VehicleDocumentationForm",
    description: "Agregar docs",
  },
  {
    path: "/newService",
    element: "VehicleServiceForm",
    description: "Agregar servicio",
  },
];

export default appRoutes;
