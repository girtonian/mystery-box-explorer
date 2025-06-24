/**
 * Route definitions for Curmunchkins Mystery Box Explorer
 * Implements child-friendly navigation with accessibility considerations
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/Home';
import Scanner from '@/pages/Scanner';
import Story from '@/pages/Story';
import Collection from '@/pages/Collection';
import Settings from '@/pages/Settings';
import ParentDashboard from '@/pages/ParentDashboard';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'scanner',
        element: <Scanner />,
      },
      {
        path: 'story/:storyId?',
        element: <Story />,
      },
      {
        path: 'collection',
        element: <Collection />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'parent',
        element: <ParentDashboard />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

// Route metadata for accessibility and navigation
export const routeMetadata = {
  '/': {
    title: 'Home - Curmunchkins Mystery Box Explorer',
    description: 'Welcome to your magical storytelling adventure!',
    icon: 'home',
    childFriendly: true,
    requiresParentPermission: false,
  },
  '/scanner': {
    title: 'Scanner - Find Your Adventure',
    description: 'Scan your Curmunchkin attachment to unlock stories',
    icon: 'scan',
    childFriendly: true,
    requiresParentPermission: false,
  },
  '/story': {
    title: 'Story Time - Your Adventure Awaits',
    description: 'Experience your personalized Curmunchkin story',
    icon: 'book',
    childFriendly: true,
    requiresParentPermission: false,
  },
  '/collection': {
    title: 'My Collection - Your Story Treasures',
    description: 'View your collected story adventures and achievements',
    icon: 'collection',
    childFriendly: true,
    requiresParentPermission: false,
  },
  '/settings': {
    title: 'Settings - Make It Just Right',
    description: 'Adjust settings to make your experience perfect',
    icon: 'settings',
    childFriendly: true,
    requiresParentPermission: false,
  },
  '/parent': {
    title: 'Parent Dashboard - Progress & Insights',
    description: 'View your child\'s progress and therapeutic insights',
    icon: 'parent',
    childFriendly: false,
    requiresParentPermission: true,
  },
} as const;

export type RouteKey = keyof typeof routeMetadata;

// Navigation helpers
export const getRouteMetadata = (path: string) => {
  return routeMetadata[path as RouteKey] || routeMetadata['/'];
};

export const isChildFriendlyRoute = (path: string): boolean => {
  const metadata = getRouteMetadata(path);
  return metadata.childFriendly;
};

export const requiresParentPermission = (path: string): boolean => {
  const metadata = getRouteMetadata(path);
  return metadata.requiresParentPermission;
};