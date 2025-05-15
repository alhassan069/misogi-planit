import axiosInstance from "../api";

export const tripApi = {
  // Trip operations
  getTrips: () => axiosInstance.get('/trips'),
  getTrip: (id) => axiosInstance.get(`/trips/${id}`),
  createTrip: (tripData) => axiosInstance.post('/trips', tripData),
  updateTrip: (id, tripData) => axiosInstance.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => axiosInstance.delete(`/trips/${id}`),
  joinTrip: (tripCode) => axiosInstance.post(`/trips/join/${tripCode}`),
  leaveTrip: (id) => axiosInstance.post(`/trips/${id}/leave`),

  // Activity operations
  createActivity: (activityData) => axiosInstance.post('/activities', activityData),
  updateActivity: (id, activityData) => axiosInstance.put(`/activities/${id}`, activityData),
  deleteActivity: (id) => axiosInstance.delete(`/activities/${id}`),

  // Vote operations
  toggleVote: (activityId) => axiosInstance.post(`/votes/activity/${activityId}`),
  getVoteStatus: (activityId) => axiosInstance.get(`/votes/activity/${activityId}/status`),
};