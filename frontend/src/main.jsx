import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout.jsx';
import { ChatRoom } from './components/ChatRoom.jsx';
import { PrivateChat } from './components/PrivateChat.jsx';
import AuthWrapper from './components/AuthWrapper.jsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthWrapper><App /></AuthWrapper>,
  },
  {
    path: "/dashboard",
    element: <Layout />,
  },
  {
    path: "/chat/:roomName",
    element: <ChatRoom />,
  },
  {
    path: "/private/:userId",
    element: <PrivateChat />,
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
