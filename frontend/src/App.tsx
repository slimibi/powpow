import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DashboardProvider } from './contexts/DashboardContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Dashboards from './pages/Dashboards';
import DataSources from './pages/DataSources';
import DashboardBuilder from './pages/DashboardBuilder';
import ChartsDemo from './pages/ChartsDemo';
import SharedWithMe from './pages/SharedWithMe';
import PublicGallery from './pages/PublicGallery';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <DashboardProvider>
            <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/dashboards"
                element={
                  <Layout>
                    <Dashboards />
                  </Layout>
                }
              />
              <Route
                path="/dashboards/:id"
                element={
                  <Layout>
                    <DashboardBuilder />
                  </Layout>
                }
              />
              <Route
                path="/data"
                element={
                  <Layout>
                    <DataSources />
                  </Layout>
                }
              />
              <Route
                path="/charts-demo"
                element={
                  <Layout>
                    <ChartsDemo />
                  </Layout>
                }
              />
              <Route
                path="/shared"
                element={
                  <Layout>
                    <SharedWithMe />
                  </Layout>
                }
              />
              <Route
                path="/public"
                element={
                  <Layout>
                    <PublicGallery />
                  </Layout>
                }
              />
              <Route
                path="/analytics"
                element={
                  <Layout>
                    <Analytics />
                  </Layout>
                }
              />
              <Route
                path="/team"
                element={
                  <Layout>
                    <Team />
                  </Layout>
                }
              />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#059669',
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: '#DC2626',
                  },
                },
              }}
            />
          </div>
            </Router>
          </DashboardProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
