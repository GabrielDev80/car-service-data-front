import api from "./axios";

export const fetchCurrentUser = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("No se encontro el id del usuario en el localStorage");
    }
    const response = await api.get(`/users/${userId}`);
    // console.log("Data: ", response);
    return response.data.payload;
  } catch (err) {
    console.log("fetchCurrentUser: ", err.message);
  }
};
