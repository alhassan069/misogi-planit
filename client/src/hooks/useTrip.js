import { useState, useEffect } from 'react';
import { tripApi } from '../utils/tripApi';

export const useTrip = (tripId) => {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchTrip = async () => {
      if (!tripId) return;
      
      try {
        setLoading(true);
        const response = await tripApi.getTrip(tripId);
        setTrip(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch trip');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchTrip();
    }, [tripId]);
  
    const addActivity = async (activityData) => {
      try {
        const response = await tripApi.createActivity({
          ...activityData,
          tripId
        });
        setTrip(prev => ({
          ...prev,
          activities: [...prev.activities, response.data]
        }));
        return response.data;
      } catch (err) {
        throw err;
      }
    };
  
    const updateActivity = async (id, activityData) => {
      try {
        const response = await tripApi.updateActivity(id, activityData);
        setTrip(prev => ({
          ...prev,
          activities: prev.activities.map(activity =>
            activity.id === id ? response.data : activity
          )
        }));
        return response.data;
      } catch (err) {
        throw err;
      }
    };
  
    const deleteActivity = async (id) => {
      try {
        await tripApi.deleteActivity(id);
        setTrip(prev => ({
          ...prev,
          activities: prev.activities.filter(activity => activity.id !== id)
        }));
      } catch (err) {
        throw err;
      }
    };
  
    const toggleVote = async (activityId) => {
      try {
        const response = await tripApi.toggleVote(activityId);
        setTrip(prev => ({
          ...prev,
          activities: prev.activities.map(activity =>
            activity.id === activityId ? response.data.activity : activity
          )
        }));
        return response.data;
      } catch (err) {
        throw err;
      }
    };
  
    return {
      trip,
      loading,
      error,
      addActivity,
      updateActivity,
      deleteActivity,
      toggleVote,
      refetch: fetchTrip,
    };
  };