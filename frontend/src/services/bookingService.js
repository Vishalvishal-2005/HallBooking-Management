// ==================== src/services/bookingService.js ====================

import api from "./api";
import { ENDPOINTS } from "../config/config";

export const createBooking = async (bookingData) => {
  const res = await api.post(ENDPOINTS.BOOKINGS, bookingData);
  return res.data;
};

export const getUserBookings = async (userId) => {
  const res = await api.get(ENDPOINTS.USER_BOOKINGS(userId));
  return res.data;
};

export const cancelBooking = async (id) => {
  const res = await api.delete(`${ENDPOINTS.BOOKINGS}/${id}`);
  return res.data;
};

export const checkAvailability = async (hallId, date, startTime, endTime) => {
  const res = await api.get(ENDPOINTS.CHECK_AVAILABILITY, {
    params: { hallId, date, startTime, endTime },
  });
  return res.data;
};
