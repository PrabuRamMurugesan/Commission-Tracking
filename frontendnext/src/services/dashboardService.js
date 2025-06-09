import axios from "axios";

const API_BASE_URL = "/api/dashboard";

export const fetchWidgets = async () => axios.get(`${API_BASE_URL}/widgets`);
export const fetchChartData = async () => axios.get(`${API_BASE_URL}/charts`);
export const fetchNotifications = async () => axios.get(`${API_BASE_URL}/notifications`);
export const fetchTasks = async () => axios.get(`${API_BASE_URL}/tasks`);
export const fetchProjects = async () => axios.get(`${API_BASE_URL}/projects`);
export const fetchEvents = async () => axios.get(`${API_BASE_URL}/events`);
export const fetchPendingWorks = async () => axios.get(`${API_BASE_URL}/pendingWorks`);
export const fetchWorkDeadlines = async () => axios.get(`${API_BASE_URL}/workDeadlines`);
export const fetchAnnouncements = async () => axios.get(`${API_BASE_URL}/announcements`);
export const fetchNotices = async () => axios.get(`${API_BASE_URL}/notices`);
export const fetchEarnings = async () => axios.get(`${API_BASE_URL}/earnings`);
export const fetchWeeklyEarnings = async () => axios.get(`${API_BASE_URL}/weeklyEarnings`);
export const fetchOlaMapLocations = async () => axios.get(`${API_BASE_URL}/olaMap`);
