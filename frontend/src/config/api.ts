// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5131';

export const API_ENDPOINTS = {
  USERS: {
    REGISTER: `${API_BASE_URL}/Users/register`,
    LOGIN: `${API_BASE_URL}/Users/login`,
    PROFILE: `${API_BASE_URL}/Users/profile`,
    UPDATE: (id: number) => `${API_BASE_URL}/Users/${id}`,
    ADD_ROLE: `${API_BASE_URL}/Users/roles`,
  },
  BOOKS: {
    GET_ALL: `${API_BASE_URL}/Books`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Books/${id}`,
    CREATE: `${API_BASE_URL}/Books`,
    UPDATE: (id: number) => `${API_BASE_URL}/Books/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Books/${id}`,
    ADD_CATEGORY: (id: number) => `${API_BASE_URL}/Books/${id}/categories`,
    ADD_AUTHOR: (id: number) => `${API_BASE_URL}/Books/${id}/authors`,
  },
  AUTHORS: {
    GET_ALL: `${API_BASE_URL}/Authors`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Authors/${id}`,
    CREATE: `${API_BASE_URL}/Authors`,
    UPDATE: (id: number) => `${API_BASE_URL}/Authors/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Authors/${id}`,
  },
  CATEGORIES: {
    GET_ALL: `${API_BASE_URL}/Categories`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Categories/${id}`,
    CREATE: `${API_BASE_URL}/Categories`,
    UPDATE: (id: number) => `${API_BASE_URL}/Categories/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Categories/${id}`,
  },
  PUBLISHERS: {
    GET_ALL: `${API_BASE_URL}/Publishers`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Publishers/${id}`,
    CREATE: `${API_BASE_URL}/Publishers`,
    UPDATE: (id: number) => `${API_BASE_URL}/Publishers/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Publishers/${id}`,
  },
  COPIES: {
    GET_ALL: `${API_BASE_URL}/Copies`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Copies/${id}`,
    CREATE: `${API_BASE_URL}/Copies`,
    UPDATE: (id: number) => `${API_BASE_URL}/Copies/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Copies/${id}`,
  },
  RENTALS: {
    GET_ALL: `${API_BASE_URL}/Rentals`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/Rentals/${id}`,
    CREATE: `${API_BASE_URL}/Rentals`,
    UPDATE: (id: number) => `${API_BASE_URL}/Rentals/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/Rentals/${id}`,
  },
};
