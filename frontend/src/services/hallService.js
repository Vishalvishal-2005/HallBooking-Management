// ==================== src/services/hallService.js ====================

import api from "./api";
import { ENDPOINTS } from "../config/config";

export const getAllHalls = async () => {
  const res = await api.get(ENDPOINTS.HALLS);
  return res.data;
};

export const getHallById = async (id) => {
  const res = await api.get(ENDPOINTS.HALL_BY_ID(id));
  return res.data;
};

export const createHall = async (hallData) => {
  const res = await api.post(ENDPOINTS.HALLS, hallData);
  return res.data;
};

export const updateHall = async (id, hallData) => {
  const res = await api.put(ENDPOINTS.HALL_BY_ID(id), hallData);
  return res.data;
};

export const deleteHall = async (id) => {
  const res = await api.delete(ENDPOINTS.HALL_BY_ID(id));
  return res.data;
};
