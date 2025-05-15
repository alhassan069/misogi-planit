import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  ThumbsUp, 
  Lock, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const categoryColors = {
  Adventure: 'bg-orange-100 text-orange-800 border-orange-200',
  Food: 'bg-green-100 text-green-800 border-green-200',
  Sightseeing: 'bg-blue-100 text-blue-800 border-blue-200',
  Other: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function TripTimeline({ activities }) {
  const timelineData = useMemo(() => {
    // Group activities by date
    const groupedByDate = activities.reduce((acc, activity) => {
      const date = activity.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    }, {});

    // Sort activities within each day by time
    Object.keys(groupedByDate).forEach(date => {
      groupedByDate[date].sort((a, b) => {
        if (!a.time && !b.time) return 0;
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
      });
    });

    // Convert to array and sort by date
    return Object.entries(groupedByDate)
      .map(([date, activities]) => ({ date, activities }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [activities]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Remove time components for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const formatTime = (time) => {
    if (!time) return null;
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDayStats = (activities) => {
    const totalCost = activities.reduce((sum, activity) => 
      sum + (parseFloat(activity.estimatedCost) || 0), 0
    );
    const lockedCount = activities.filter(activity => {
      const votes = activity.userVotes || activity.votes || [];
      return votes.length >= 2;
    }).length;
    const totalVotes = activities.reduce((sum, activity) => {
      const votes = activity.userVotes || activity.votes || [];
      return sum + votes.length;
    }, 0);

    return { totalCost, lockedCount, totalVotes };
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle>No activities scheduled</CardTitle>
          <CardDescription>
            Add some activities to see your trip timeline.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {timelineData.map((day, dayIndex) => {
        const { totalCost, lockedCount, totalVotes } = getDayStats(day.activities);
        const isToday = formatDate(day.date) === 'Today';
        const isTomorrow = formatDate(day.date) === 'Tomorrow';

        return (
          <Card key={day.date} className={cn(
            'relative',
            isToday && 'ring-2 ring-blue-200 bg-blue-50/50'
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={cn(
                    'text-lg flex items-center',
                    isToday && 'text-blue-600'
                  )}>
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {formatDate(day.date)}
                    {(isToday || isTomorrow) && (
                      <Badge variant={isToday ? "default" : "secondary"} className="ml-2">
                        {isToday ? 'Today' : 'Tomorrow'}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
                  </CardDescription>
                </div>
                
                {/* Day Stats */}
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {totalCost > 0 && (
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-3 w-3" />
                      ${totalCost.toFixed(2)}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Lock className="mr-1 h-3 w-3" />
                    {lockedCount}/{day.activities.length} locked
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    {totalVotes} votes
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {day.activities.map((activity, activityIndex) => {
                  const votes = activity.userVotes || activity.votes || [];
                  const isLocked = votes.length >= 2;
                  
                  return (
                    <div
                      key={activity.id}
                      className={cn(
                        'relative flex items-start space-x-4 p-4 rounded-lg border',
                        isLocked && 'bg-green-50 border-green-200',
                        !isLocked && 'bg-background',
                        activityIndex < day.activities.length - 1 && 'border-b-0'
                      )}
                    >
                      {/* Time indicator */}
                      <div className="flex-shrink-0 w-16 text-center">
                        {activity.time ? (
                          <div className="text-sm font-medium">
                            {formatTime(activity.time)}
                          </div>
                        ) : (
                          <div className="w-2 h-2 bg-muted rounded-full mx-auto" />
                        )}
                      </div>

                      {/* Activity details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-base">{activity.name}</h4>
                              {isLocked && (
                                <Badge variant="success" className="flex items-center">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Locked
                                </Badge>
                              )}
                              <Badge 
                                variant="outline" 
                                className={categoryColors[activity.category]}
                              >
                                {activity.category}
                              </Badge>
                            </div>

                            {activity.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {activity.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              {activity.estimatedCost && (
                                <div className="flex items-center">
                                  <DollarSign className="mr-1 h-3 w-3" />
                                  ${parseFloat(activity.estimatedCost).toFixed(2)}
                                </div>
                              )}
                              
                              <div className="flex items-center">
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                {votes.length} votes
                              </div>

                              <div className="flex items-center">
                                <span>by</span>
                                <Avatar className="w-4 h-4 mx-1">
                                  <AvatarFallback className="text-xs">
                                    {activity.creator.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{activity.creator.name}</span>
                              </div>
                            </div>

                            {activity.notes && (
                              <p className="text-xs text-muted-foreground mt-2 italic">
                                {activity.notes}
                              </p>
                            )}
                          </div>

                          {/* Voters */}
                          {votes.length > 0 && (
                            <div className="flex -space-x-1 ml-4">
                              {votes.slice(0, 3).map((vote, voteIndex) => (
                                <Avatar key={vote.id || `vote-${voteIndex}`} className="w-6 h-6 border border-background">
                                  <AvatarFallback className="text-xs">
                                    {vote.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {votes.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center">
                                  <span className="text-xs">+{votes.length - 3}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
