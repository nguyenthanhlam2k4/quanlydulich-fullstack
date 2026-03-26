import API from "./api";

export const getUsers = () => API.get("/users");
export const deleteUser = (id) => API.delete(`/users/${id}`);