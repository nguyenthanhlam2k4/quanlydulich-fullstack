import API from "./api";

export const getUsers = (params) => API.get("/users", { params });
export const createUser = (data) => API.post("/users", data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const softDeleteUser = (id) => API.patch(`/users/${id}/soft-delete`);
export const restoreUser = (id) => API.patch(`/users/${id}/restore`);
export const deleteUser = (id) => API.delete(`/users/${id}`);