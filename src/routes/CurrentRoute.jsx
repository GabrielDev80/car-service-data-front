import { useLocation } from "react-router-dom";

export default function CurrentRoute() {
  const location = useLocation();
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "#0008",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "8px",
        fontSize: "14px",
      }}
    >
      Ruta actual: {location.pathname}
    </div>
  );
}
