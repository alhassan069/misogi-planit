import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { tripApi } from '../../utils/tripApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function JoinTripPage() {
  const { tripCode } = useParams();
  const { user } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error, joining
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setStatus('unauthenticated');
      return;
    }

    if (tripCode) {
      joinTrip(tripCode);
    }
  }, [tripCode, user]);

  const joinTrip = async (code) => {
    try {
      setStatus('joining');
      const response = await tripApi.joinTrip(code);
      setTrip(response.data);
      setStatus('success');
      localStorage.setItem('lastActiveTrip', response.data.id);
      toast.success(`Successfully joined trip "${response.data.name}"!` )
    } catch (error) {
      console.error('Error joining trip:', error);
      setError(error.response?.data?.error || 'Failed to join trip');
      setStatus('error');
    }
  };

  const handleViewTrip = () => {
    if (trip) {
      navigate(`/dashboard/trips/${trip.id}`);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard/trips');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to join a trip.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/signup')}
              className="w-full"
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          {status === 'loading' || status === 'joining' ? (
            <>
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
              <CardTitle>
                {status === 'loading' ? 'Loading...' : 'Joining Trip...'}
              </CardTitle>
              <CardDescription>
                Please wait while we process your request.
              </CardDescription>
            </>
          ) : status === 'success' ? (
            <>
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Trip Joined Successfully!</CardTitle>
              <CardDescription>
                You're now part of "{trip?.name}"
              </CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Failed to Join Trip</CardTitle>
              <CardDescription>{error}</CardDescription>
            </>
          )}
        </CardHeader>

        {(status === 'success' || status === 'error') && (
          <CardContent className="space-y-3">
            {status === 'success' && trip && (
              <>
                <div className="text-center text-sm text-muted-foreground space-y-1">
                  <p>Trip Code: <code className="font-mono">{trip.tripCode}</code></p>
                  <p>{trip?.participants?.length} participants</p>
                  <p>{trip?.activities?.length} activities planned</p>
                </div>
                <Button onClick={handleViewTrip} className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  View Trip Details
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              onClick={handleGoToDashboard} 
              className="w-full"
            >
              Go to Dashboard
            </Button>
            
            {status === 'error' && (
              <Button 
                onClick={() => joinTrip(tripCode)} 
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
