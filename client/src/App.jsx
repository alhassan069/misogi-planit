import { useLayoutEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Home from "./pages/site/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/site/NotFound";
import Terms from "./pages/site/Terms";
import Privacy from "./pages/site/Privacy";
import Contact from "./pages/site/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/shadcn_components/theme-provider";

export default function App() {
  const { user, checkAuth } = useAuth();
  useLayoutEffect(() => {
    checkAuth();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={user ? <Navigate replace to={"/dashboard"} /> : <Navigate replace to={"/home"} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {user && (
          <>
            <Route path="/dashboard"  element={<Layout />} >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </>
        )}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}