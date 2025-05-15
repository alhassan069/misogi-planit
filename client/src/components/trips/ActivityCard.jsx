import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  ThumbsUp,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  StickyNote
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
import { cn } from '../../lib/utils';

const categoryColors = {
  Adventure: 'bg-orange-100 text-orange-800 border-orange-200',
  Food: 'bg-green-100 text-green-800 border-green-200',
  Sightseeing: 'bg-blue-100 text-blue-800 border-blue-200',
  Other: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function ActivityCard({ activity, currentUser, onUpdate, onDelete, onVoteToggle }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Handle both votes and userVotes properties
  const votes = Array.isArray(activity.userVotes) ? activity.userVotes : 
               (Array.isArray(activity.votes) ? activity.votes : []);
  
  const isLocked = votes.length >= 2;
  const userHasVoted = votes.some(vote => vote.user?.id === currentUser.id);
  const isCreator = activity.creator?.id === currentUser.id;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return null;
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleVote = () => {
    onVoteToggle(activity.id);
  };

  const handleEdit = () => {
    // This would open an edit dialog
    console.log('Edit activity:', activity.id);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(activity.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className={cn(
        'hover:shadow-md transition-shadow',
        isLocked && 'ring-2 ring-green-200 bg-green-50/50'
      )}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{activity.name}</h3>
                {isLocked && (
                  <Badge variant="success" className="flex items-center">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked In
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(activity.date)}
                </div>
                {activity.time && (
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTime(activity.time)}
                  </div>
                )}
                <Badge 
                  variant="outline" 
                  className={categoryColors[activity.category]}
                >
                  {activity.category}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isCreator && (
                  <>
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Activity
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Activity
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Description */}
            {activity.description && (
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            )}

            {/* Cost */}
            {activity.estimatedCost && (
              <div className="flex items-center text-sm">
                <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                <span>Estimated cost: ${parseFloat(activity.estimatedCost).toFixed(2)}</span>
              </div>
            )}

            {/* Notes */}
            {activity.notes && (
              <div className="flex items-start text-sm">
                <StickyNote className="mr-1 h-3 w-3 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{activity.notes}</span>
              </div>
            )}

            {/* Voting Section */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant={userHasVoted ? "default" : "outline"}
                  size="sm"
                  onClick={handleVote}
                  className={cn(
                    userHasVoted && "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  <ThumbsUp className={cn(
                    "mr-1 h-3 w-3",
                    userHasVoted && "fill-current"
                  )} />
                  Vote ({votes.length})
                </Button>
                <span className="text-xs text-muted-foreground">
                  {votes.length >= 2 ? 'Locked' : `${2 - votes.length} more to lock`}
                </span>
              </div>

              {/* Voters */}
              {votes.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-muted-foreground">Voted by:</span>
                  <div className="flex -space-x-1">
                    {votes.slice(0, 3).map((vote) => (
                      <Avatar key={vote.user?.id} className="w-6 h-6 border border-background">
                        <AvatarFallback className="text-xs">
                          {vote.user?.name?.charAt(0)?.toUpperCase() || ''}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {votes.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center">
                        <span className="text-xs">+{votes.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <span>Added by </span>
                <Avatar className="w-4 h-4 mx-1">
                  <AvatarFallback className="text-xs">
                    {activity.creator?.name?.charAt(0)?.toUpperCase() || ''}
                  </AvatarFallback>
                </Avatar>
                <span>{activity.creator?.name}</span>
              </div>
              <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{activity.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
