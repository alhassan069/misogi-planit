import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTrip } from '../../hooks/useTrip';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Calendar,
  Users,
  DollarSign,
  Plus,
  Share2,
  Copy,
  Filter,
  SortAsc,
  SortDesc,
  CheckSquare,
  Clock,
  MapPin
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import { ActivityCard } from './ActivityCard';
import { CreateActivityDialog } from './CreateActivityDialog';
import { BudgetChart } from './BudgetChart';
import { TripTimeline } from './TripTimeline';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Skeleton } from '../ui/skeleton';

export function TripDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { trip, loading, error, addActivity, updateActivity, deleteActivity, toggleVote } = useTrip(id);
  
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  // Load trip-specific filters from localStorage
  const [hideLockedActivities, setHideLockedActivities] = useState(() => {
    return localStorage.getItem(`trip-${id}-hideLockedActivities`) === 'true';
  });

  // Save filter preferences to localStorage
  const saveFilterPreferences = (newFilter) => {
    localStorage.setItem(`trip-${id}-hideLockedActivities`, newFilter.toString());
    setHideLockedActivities(newFilter);
  };

  // Filtered and sorted activities
  const filteredActivities = useMemo(() => {
    if (!trip?.activities) return [];

    let filtered = trip.activities;

    // Apply category filter
    if (activityFilter !== 'all') {
      if (activityFilter === 'locked') {
        filtered = filtered.filter(activity => activity.votes?.length >= 2);
      } else if (activityFilter === 'unlocked') {
        filtered = filtered.filter(activity => activity.votes?.length < 2);
      } else {
        filtered = filtered.filter(activity => activity.category === activityFilter);
      }
    }

    // Hide locked activities if needed
    if (hideLockedActivities) {
      filtered = filtered.filter(activity => activity.votes?.length < 2);
    }

    // Sort activities
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'votes-desc':
          return b.votes?.length - a.votes?.length;
        case 'votes-asc':
          return a.votes?.length - b.votes?.length;
        case 'cost-desc':
          return (parseFloat(b.estimatedCost) || 0) - (parseFloat(a.estimatedCost) || 0);
        case 'cost-asc':
          return (parseFloat(a.estimatedCost) || 0) - (parseFloat(b.estimatedCost) || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [trip?.activities, activityFilter, sortBy, hideLockedActivities]);

  const handleCreateActivity = async (activityData) => {
    try {
      await addActivity(activityData);
      setShowCreateActivity(false);
      toast.success("Activity created!")
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error("Failed to create activity")
     
    }
  };

  const handleUpdateActivity = async (activityId, activityData) => {
    try {
      await updateActivity(activityId, activityData);
      
      toast.success("Activity updated!")
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error("Failed to update activity")
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivity(activityId);
  
      toast.success("Activity deleted!")
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error("Failed to delete activity")
    }
  };

  const handleVoteToggle = async (activityId) => {
    try {
      await toggleVote(activityId);
    } catch (error) {
      console.error('Error toggling vote:', error);
      toast.error("Failed to vote")
    }
  };

  const copyTripCode = async () => {
    try {
      await navigator.clipboard.writeText(trip.tripCode);
      toast.success(`Trip code copied! Share "${trip.tripCode}" with friends to invite them.`)
    } catch (error) {
      toast.error("Failed to copy")
    }
  };

  const copyTripLink = async () => {
    try {
      const url = `${window.location.origin}/join/${trip.tripCode}`;
      await navigator.clipboard.writeText(url);
      toast.success("Trip link copied! Share this link to invite friends to your trip.")
    } catch (error) {
      toast.error("Failed to copy")
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
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

  if (!trip) {
    return null;
  }

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const totalCost = trip.activities.reduce((sum, activity) => 
    sum + (parseFloat(activity.estimatedCost) || 0), 0
  );
  const totalVotes = trip.activities.reduce((sum, activity) => 
    sum + (activity.votes?.length || 0), 0
  );
  const lockedActivities = trip.activities.filter(activity => 
    activity.votes?.length >= 2
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{trip.name}</h1>
            <p className="text-muted-foreground">{trip.description}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant="outline">{trip.tripCode}</Badge>
              <span className="text-sm text-muted-foreground">
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={copyTripCode}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
            <Button variant="outline" onClick={copyTripLink}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
            <Button onClick={() => setShowCreateActivity(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trip.activities.length}</div>
              <p className="text-xs text-muted-foreground">
                {lockedActivities} locked
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes}</div>
              <p className="text-xs text-muted-foreground">
                From {trip.participants.length} participants
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalCost.toFixed(2)}
              </div>
              {trip.budget && (
                <p className="text-xs text-muted-foreground">
                  of ${parseFloat(trip.budget).toFixed(2)} budget
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trip.participants.length}</div>
              <div className="flex -space-x-1 mt-2">
                {trip.participants.slice(0, 3).map((participant) => (
                  <Avatar key={participant.id} className="w-6 h-6 border border-background">
                    <AvatarFallback className="text-xs">
                      {participant.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {trip.participants.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center">
                    <span className="text-xs">+{trip.participants.length - 3}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="activities" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                    <SelectItem value="unlocked">Unlocked</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Sightseeing">Sightseeing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    {sortBy.includes('asc') ? 
                      <SortAsc className="mr-2 h-4 w-4" /> : 
                      <SortDesc className="mr-2 h-4 w-4" />
                    }
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-asc">Date (Earliest)</SelectItem>
                    <SelectItem value="date-desc">Date (Latest)</SelectItem>
                    <SelectItem value="votes-desc">Most Voted</SelectItem>
                    <SelectItem value="votes-asc">Least Voted</SelectItem>
                    <SelectItem value="cost-desc">Highest Cost</SelectItem>
                    <SelectItem value="cost-asc">Lowest Cost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideLockedActivities}
                    onChange={(e) => saveFilterPreferences(e.target.checked)}
                    className="mr-2"
                  />
                  Hide locked activities
                </label>
              </div>
            </div>

            {/* Activities List */}
            {filteredActivities.length === 0 ? (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle>No activities yet</CardTitle>
                  <CardDescription>
                    Start planning by adding your first activity to this trip.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button onClick={() => setShowCreateActivity(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    currentUser={user}
                    onUpdate={handleUpdateActivity}
                    onDelete={handleDeleteActivity}
                    onVoteToggle={handleVoteToggle}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline">
            <TripTimeline activities={trip.activities} />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetChart trip={trip} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Activity Dialog */}
      <CreateActivityDialog
        open={showCreateActivity}
        onOpenChange={setShowCreateActivity}
        onSubmit={handleCreateActivity}
        tripDates={{ startDate, endDate }}
      />
    </div>
  );
}
