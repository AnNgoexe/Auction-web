import axios from 'axios';
import axiosClient from "@/utils/axios.js";

const AUTH_API = {
  LOGIN: '/auth/login',
  REFRESH_TOKEN: 'auth/refresh-token',
  REGISTER: '/auth/register',
  RESEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  CHECK_EMAIL: '/auth/check-email',
  RESET_PASSWORD: '/auth/reset-password',
};

export const authService = {
  refreshToken: async (tokenPayload) => {
    try {
      const response = await axios.post(
        AUTH_API.REFRESH_TOKEN,
        tokenPayload,
        {
          baseURL: import.meta.env.VITE_BACKEND_URL,
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
          timeout: 10000,
        }
      );
      return response.data;
    } catch (err) {
      const { statusCode, message, errorCode } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || err?.response?.status || 500,
        message: message || 'Failed to refresh token',
        errorCode: errorCode || 'INTERNAL_SERVER_ERROR',
      });
    }
  },

  login: async (credentials) => {
    try {
      const response = await axiosClient.post(
        AUTH_API.LOGIN,
        credentials
      );
      return response.data;
    } catch (err) {
      const { message, errorCode, statusCode } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Login failed',
        errorCode: errorCode || 'INTERNAL_SERVER_ERROR',
      });
    }
  },

  register: async (payload) => {
    try {
      const response = await axiosClient.post(AUTH_API.REGISTER, payload);
      return response.data;
    } catch(err) {
      const { message, errorCode, statusCode } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Registration failed',
        errorCode: errorCode || 'INTERNAL_SERVER_ERROR',
      });
    }
  },

  resendOtp: async (payload) => {
    try {
      const response = await axiosClient.post(AUTH_API.RESEND_OTP, payload);
      return response.data;
    } catch (err) {
      const { message, errorCode, statusCode } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Failed to resend OTP',
        errorCode: errorCode || 'INTERNAL_SERVER_ERROR',
      });
    }
  },

  verifyOtp: async (payload) => {
    try {
      const response = await axiosClient.post(AUTH_API.VERIFY_OTP, payload);
      return response.data;
    } catch (err) {
      const { message, errorCode, statusCode } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Failed to verify OTP',
        errorCode: errorCode || 'INTERNAL_SERVER_ERROR',
      });
    }
  },

  checkEmail: async (payload) => {
    try {
      const response = await axiosClient.post(AUTH_API.CHECK_EMAIL, payload);
      return response.data;
    } catch (err) {
      const { message, errorCode, statusCode } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Failed to check email',
        errorCode: errorCode || 'INTERNAL_SERVER_ERROR',
      });
    }
  },

  resetPassword: async (payload) => {
    try {
      const response = await axiosClient.post(AUTH_API.RESET_PASSWORD, payload);
      return response.data;
    } catch (err) {
      const { message, errorCode, statusCode } = err?.response?.data || {};
      return Promise.reject({
        statusCode: statusCode || 500,
        message: message || 'Failed to reset password',
        errorCode: errorCode || 'INTERNAL_SERVER_ERROR',
      });
    }
  },
};
