import axios from 'axios';

const AUTH_API = {
  REFRESH_TOKEN: 'api/users/refresh-token',
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
};
