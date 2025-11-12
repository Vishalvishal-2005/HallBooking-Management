// ==================== src/config/config.js ====================

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3060/api";

export const ENDPOINTS = {
  // Authentication
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  PROFILE: "/auth/profile",
  LOGOUT: "/auth/logout",

  // Halls
  HALLS: "/halls",
  HALL_BY_ID: (id) => `/halls/${id}`,

  // Bookings
  BOOKINGS: "/bookings",
  USER_BOOKINGS: (userId) => `/bookings/user/${userId}`,
  CHECK_AVAILABILITY: "/bookings/check",
};
