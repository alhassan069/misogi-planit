import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Users, CalendarHeart, DollarSign, Vote, Map } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          Plan Trips <span className="text-primary">Together</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
          Say goodbye to chaotic group planning. With Planit, you and your friends can co-create itineraries, share budgets, vote on activities, and finalize everything in one place.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/signup">
            <Button size="lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary" />
              <CardTitle>Collaborate with Friends</CardTitle>
              <CardDescription>
                Invite your group and plan in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>Invite collaborators</li>
                <li>Real-time updates and changes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Map className="h-10 w-10 text-primary" />
              <CardTitle>Create Custom Itineraries</CardTitle>
              <CardDescription>
                Add destinations, activities, and schedules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>Organized trip timeline</li>
                <li>Shared activity lists</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-10 w-10 text-primary" />
              <CardTitle>Track Budgets Easily</CardTitle>
              <CardDescription>
                Assign and view spending in one place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>Budget per activity/person</li>
                <li>Visual breakdown</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Vote className="h-10 w-10 text-primary" />
              <CardTitle>Vote on Activities</CardTitle>
              <CardDescription>
                Let the group decide what to do.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>Simple upvote system</li>
                <li>Finalize with consensus</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CalendarHeart className="h-10 w-10 text-primary" />
              <CardTitle>Smart Scheduling</CardTitle>
              <CardDescription>
                Sync everyone's availability easily.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>Conflict-free planning</li>
                <li>Shared calendar view</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2024 Planit. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/terms">
              <Button variant="ghost" size="sm">
                Terms
              </Button>
            </Link>
            <Link to="/privacy">
              <Button variant="ghost" size="sm">
                Privacy
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="sm">
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;