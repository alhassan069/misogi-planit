import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  MapPin, 
  MoreVertical,
  Edit,
  Trash2,
  LogOut,
  Copy,
  Eye,
  ThumbsUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
export function TripCard({ trip, onDelete, onLeave }) {
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const navigate = useNavigate();
  const isCreator = trip.creator.id === user?.id;
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const totalActivities = trip.activities.length;
  const totalVotes = trip.activities.reduce((sum, activity) => sum + activity.votes.length, 0);
  const lockedActivities = trip.activities.filter(activity => activity.votes.length >= 2).length;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const days = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Started';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days left`;
  };

  const copyTripCode = async () => {
    try {
      await navigator.clipboard.writeText(trip.tripCode);
      
      toast.success(`Trip code copied! Share "${trip.tripCode}" with friends to invite them.`)
    } catch (error) {
      toast.error("Failed to copy trip code to clipboard.")
    }
  };

  const handleViewTrip = () => {
    localStorage.setItem('lastActiveTrip', trip.id);
    navigate(`/dashboard/trips/${trip.id}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleLeave = () => {
    setShowLeaveDialog(true);
  };

  const confirmDelete = () => {
    onDelete(trip.id);
    setShowDeleteDialog(false);
  };

  const confirmLeave = () => {
    onLeave(trip.id);
    setShowLeaveDialog(false);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {trip.name}
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {trip.description || 'No description'}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewTrip}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Trip
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyTripCode}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Trip Code
                </DropdownMenuItem>
                {isCreator && (
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Trip
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {isCreator ? (
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Trip
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    onClick={handleLeave}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Leave Trip
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4 mt-3">
            <Badge variant="outline">
              {trip.tripCode}
            </Badge>
            <Badge variant={startDate > new Date() ? 'default' : 'secondary'}>
              {getDaysRemaining()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0" onClick={handleViewTrip}>
          <div className="space-y-3">
            {/* Date Range */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(startDate)} - {formatDate(endDate)}
            </div>

            {/* Budget */}
            {trip.budget && (
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="mr-2 h-4 w-4" />
                Budget: ${parseFloat(trip.budget).toFixed(2)}
              </div>
            )}

            {/* Activities Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {totalActivities} activities
              </div>
              <div className="flex items-center text-muted-foreground">
                <ThumbsUp className="mr-2 h-4 w-4" />
                {totalVotes} votes
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Locked Activities</span>
                <span>{lockedActivities} / {totalActivities}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: totalActivities ? `${(lockedActivities / totalActivities) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {trip.participants.slice(0, 4).map((participant, index) => (
                  <Avatar key={participant.id} className="w-8 h-8 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {participant.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {trip.participants.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      +{trip.participants.length - 4}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-3 w-3" />
                {trip.participants.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trip
              "{trip.name}" and all its activities and votes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave trip?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave "{trip.name}"? You'll need to be invited
              again to rejoin this trip.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmLeave}
              className="bg-red-600 hover:bg-red-700"
            >
              Leave Trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
