import api from "./axios";
import { useState } from "react";

export const fetchCurrentUser = async () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("No se encontro el id del usuario en el localStorage");
    }
    const response = await api.get(`/users/${userId}`);
    console.log("Data: ", response);
    return setCurrentUser(response.data.payload);
  } catch (error) {
    setError(err.message);
  }
};
