import { useState, useEffect } from 'react';
import { tripApi } from '../utils/tripApi';

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripApi.getTrips();
      setTrips(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const createTrip = async (tripData) => {
    try {
      const response = await tripApi.createTrip(tripData);
      setTrips(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateTrip = async (id, tripData) => {
    try {
      const response = await tripApi.updateTrip(id, tripData);
      setTrips(prev => prev.map(trip => 
        trip.id === id ? response.data : trip
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteTrip = async (id) => {
    try {
      await tripApi.deleteTrip(id);
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const joinTrip = async (tripCode) => {
    try {
      const response = await tripApi.joinTrip(tripCode);
      setTrips(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const leaveTrip = async (id) => {
    try {
      await tripApi.leaveTrip(id);
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    trips,
    loading,
    error,
    createTrip,
    updateTrip,
    deleteTrip,
    joinTrip,
    leaveTrip,
    refetch: fetchTrips,
  };
};

