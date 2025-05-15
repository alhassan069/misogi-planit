import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

const COLORS = {
  Adventure: '#ff6b6b',
  Food: '#4ecdc4',
  Sightseeing: '#45b7d1',
  Other: '#96ceb4',
};

export function BudgetChart({ trip }) {
  const budgetData = useMemo(() => {
    const activities = trip.activities;
    const totalBudget = parseFloat(trip.budget) || 0;
    
    // Calculate spending by category
    const categorySpending = activities.reduce((acc, activity) => {
      const cost = parseFloat(activity.estimatedCost) || 0;
      acc[activity.category] = (acc[activity.category] || 0) + cost;
      return acc;
    }, {});

    // Convert to chart data format
    const pieData = Object.entries(categorySpending).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: COLORS[category],
    }));

    // Calculate totals
    const totalSpent = activities.reduce((sum, activity) => 
      sum + (parseFloat(activity.estimatedCost) || 0), 0
    );
    const remaining = totalBudget - totalSpent;
    const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Locked vs unlocked spending
    const lockedSpending = activities
      .filter(activity => activity.votes.length >= 2)
      .reduce((sum, activity) => sum + (parseFloat(activity.estimatedCost) || 0), 0);
    
    const unlockedSpending = totalSpent - lockedSpending;

    // Daily spending projection
    const dailyData = activities.reduce((acc, activity) => {
      const date = activity.date;
      const cost = parseFloat(activity.estimatedCost) || 0;
      const isLocked = activity.votes.length >= 2;
      
      if (!acc[date]) {
        acc[date] = { date, locked: 0, unlocked: 0, total: 0 };
      }
      
      if (isLocked) {
        acc[date].locked += cost;
      } else {
        acc[date].unlocked += cost;
      }
      acc[date].total += cost;
      
      return acc;
    }, {});

    const dailySpending = Object.values(dailyData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    return {
      pieData: pieData.filter(item => item.value > 0),
      totalBudget,
      totalSpent,
      remaining,
      percentage,
      lockedSpending,
      unlockedSpending,
      dailySpending,
      categorySpending,
    };
  }, [trip]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${budgetData.totalBudget.toFixed(2)}
            </div>
            {budgetData.totalBudget > 0 && (
              <p className="text-xs text-muted-foreground">
                {budgetData.percentage.toFixed(1)}% used
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${budgetData.totalSpent.toFixed(2)}
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-green-600">
                ${budgetData.lockedSpending.toFixed(2)} locked
              </span>
              <span className="text-muted-foreground">
                + ${budgetData.unlockedSpending.toFixed(2)} pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            {budgetData.remaining < 0 ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              budgetData.remaining < 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              ${Math.abs(budgetData.remaining).toFixed(2)}
            </div>
            {budgetData.remaining < 0 && (
              <Badge variant="destructive" className="text-xs">
                Over Budget
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              Breakdown of estimated costs by activity type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {budgetData.pieData.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={budgetData.pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name}: $${entry.value.toFixed(2)}`}
                    >
                      {budgetData.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2">
                  {budgetData.pieData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-semibold ml-auto">
                        ${item.value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No spending data available yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Spending Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Spending</CardTitle>
            <CardDescription>
              Estimated costs by day (locked vs. pending)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {budgetData.dailySpending.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={budgetData.dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatDate}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value, name) => [`$${value.toFixed(2)}`, name === 'locked' ? 'Locked' : 'Pending']}
                  />
                  <Legend />
                  <Bar dataKey="locked" stackId="a" fill="#22c55e" name="locked" />
                  <Bar dataKey="unlocked" stackId="a" fill="#f59e0b" name="unlocked" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No daily spending data available yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress Bar */}
      {budgetData.totalBudget > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Spent vs Budget</span>
                <span>{budgetData.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    budgetData.percentage > 100 
                      ? 'bg-red-500' 
                      : budgetData.percentage > 80 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min(budgetData.percentage, 100)}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>${budgetData.totalBudget.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}