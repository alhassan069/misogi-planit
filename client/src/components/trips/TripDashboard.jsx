import { useState, useEffect } from 'react';
import { useTrips } from '../../hooks/useTrips';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Plus, Map, Users, Calendar, DollarSign } from 'lucide-react';
import { CreateTripDialog } from './CreateTripDialog';
import { JoinTripDialog } from './JoinTripDialog';
import { TripCard } from './TripCard';
import { Skeleton } from '../ui/skeleton';
import { useNavigate } from 'react-router-dom';
export function TripDashboard() {
  const { trips, loading, error, createTrip, joinTrip, deleteTrip, leaveTrip } = useTrips();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const navigate = useNavigate();
  // Load last active trip from localStorage
  useEffect(() => {
    const lastActiveTrip = localStorage.getItem('lastActiveTrip');
    if (lastActiveTrip && trips.length > 0) {
      const trip = trips.find(t => t.id === lastActiveTrip);
      if (trip) {
        // Navigate to trip details if needed
      }
    }
  }, [trips]);

  const handleCreateTrip = async (tripData) => {
    try {
      const newTrip = await createTrip(tripData);
      localStorage.setItem('lastActiveTrip', newTrip.id);
      setShowCreateDialog(false);
      // Navigate to the new trip
      navigate(`/dashboard/trips/${newTrip.id}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  const handleJoinTrip = async (tripCode) => {
    try {
      const trip = await joinTrip(tripCode);
      localStorage.setItem('lastActiveTrip', trip.id);
      setShowJoinDialog(false);
      // Navigate to the joined trip
      navigate(`/dashboard/trips/${trip.id}`);
    } catch (error) {
      console.error('Failed to join trip:', error);
      throw error;
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteTrip(tripId);
      // Clear from localStorage if it was the last active trip
      if (localStorage.getItem('lastActiveTrip') === tripId) {
        localStorage.removeItem('lastActiveTrip');
      }
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  const handleLeaveTrip = async (tripId) => {
    try {
      await leaveTrip(tripId);
      // Clear from localStorage if it was the last active trip
      if (localStorage.getItem('lastActiveTrip') === tripId) {
        localStorage.removeItem('lastActiveTrip');
      }
    } catch (error) {
      console.error('Failed to leave trip:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Trips</h1>
            <p className="text-muted-foreground">
              Plan and collaborate on amazing trips with friends
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowJoinDialog(true)} variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Join Trip
            </Button>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Trip
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {trips.length > 0 && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trips.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trips.filter(trip => new Date(trip.endDate) >= new Date()).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trips.reduce((sum, trip) => sum + trip.activities.length, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${trips.reduce((sum, trip) => sum + (parseFloat(trip.budget) || 0), 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <Map className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle>No trips yet</CardTitle>
              <CardDescription>
                Start planning your next adventure by creating a new trip or joining an existing one.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center space-x-2">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Trip
              </Button>
              <Button onClick={() => setShowJoinDialog(true)} variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Join a Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDelete={handleDeleteTrip}
                onLeave={handleLeaveTrip}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateTripDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateTrip}
      />
      <JoinTripDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
        onSubmit={handleJoinTrip}
      />
    </div>
  );
}