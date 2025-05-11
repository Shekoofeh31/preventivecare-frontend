// apiClient.js
import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/auth
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoint functions organized by routes
const api = {
  // Health checks
  healthCheck: () => apiClient.get('/api/health'),
  
  // Health Chat endpoints
  healthChat: {
    register: (userData) => apiClient.post('/api/health-chat/register', userData),
    login: (credentials) => apiClient.post('/api/health-chat/login', credentials),
    logout: () => apiClient.post('/api/health-chat/logout'),
    getRooms: () => apiClient.get('/api/health-chat/rooms'),
    createRoom: (roomData) => apiClient.post('/api/health-chat/rooms', roomData),
    getRoom: (roomId) => apiClient.get(`/api/health-chat/rooms/${roomId}`),
    getMessages: (roomId) => apiClient.get(`/api/health-chat/rooms/${roomId}/messages`),
    sendMessage: (roomId, messageData) => apiClient.post(`/api/health-chat/rooms/${roomId}/messages`, messageData),
  },
  
  // Risk Assessment endpoints
  riskAssessment: {
    assess: (assessmentData) => apiClient.post('/api/risk-assessment/assess', assessmentData),
    getFactors: () => apiClient.get('/api/risk-assessment/factors'),
    getRecommendations: (riskFactor) => apiClient.get(`/api/risk-assessment/recommendations/${riskFactor}`),
    saveAssessment: (assessmentData) => apiClient.post('/api/risk-assessment/save-assessment', assessmentData),
  },
  
  // Preventive Featured endpoints
  preventiveFeatured: {
    getArticles: () => apiClient.get('/api/preventive-featured/articles'),
    getArticle: (articleId) => apiClient.get(`/api/preventive-featured/articles/${articleId}`),
    getFeaturedArticles: () => apiClient.get('/api/preventive-featured/featured-articles'),
    getResources: () => apiClient.get('/api/preventive-featured/resources'),
    getResource: (resourceId) => apiClient.get(`/api/preventive-featured/resources/${resourceId}`),
    getCategories: () => apiClient.get('/api/preventive-featured/categories'),
    getCategory: (categoryId) => apiClient.get(`/api/preventive-featured/categories/${categoryId}`),
    getSubcategories: (categoryId) => apiClient.get(`/api/preventive-featured/categories/${categoryId}/subcategories`),
    getHealthTopics: () => apiClient.get('/api/preventive-featured/health-topics'),
    getHealthCalendar: () => apiClient.get('/api/preventive-featured/health-calendar'),
    getPreventiveTips: () => apiClient.get('/api/preventive-featured/preventive-tips'),
  },
  
  // Search endpoints
  search: {
    search: (query) => apiClient.get('/api/search/', { params: { q: query } }),
    getPopular: () => apiClient.get('/api/search/popular'),
    getAutocomplete: (query) => apiClient.get('/api/search/autocomplete', { params: { q: query } }),
  },
  
  // Symptom Checker endpoints
  symptomChecker: {
    analyze: (symptoms) => apiClient.post('/api/symptom-checker/analyze', symptoms),
    test: (testData) => apiClient.post('/api/symptom-checker/test', testData),
  },
};

export default api;
