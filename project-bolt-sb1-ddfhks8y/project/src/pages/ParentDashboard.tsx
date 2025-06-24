/**
 * Parent dashboard placeholder - Progress tracking and controls
 * Will be implemented in later steps
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Shield, Settings, Clock } from 'lucide-react';

const ParentDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-primary">
          Parent Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Monitor your child's progress and manage safety settings
        </p>
      </div>

      {/* Dashboard cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-primary">Progress</h3>
          <p className="text-2xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-600">Stories completed</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-primary">Time Spent</h3>
          <p className="text-2xl font-bold text-green-600">0m</p>
          <p className="text-sm text-gray-600">This week</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-primary">Safety</h3>
          <p className="text-2xl font-bold text-purple-600">✓</p>
          <p className="text-sm text-gray-600">All systems secure</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
            <Settings className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-primary">Settings</h3>
          <p className="text-2xl font-bold text-amber-600">5</p>
          <p className="text-sm text-gray-600">Customizations</p>
        </div>
      </div>

      {/* Coming soon message */}
      <div className="bg-white rounded-2xl p-12 shadow-soft text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 font-primary">
          Parent Dashboard Coming Soon
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Detailed progress tracking, therapeutic insights, and parental controls will be available in the next update.
        </p>
      </div>

      {/* Back navigation */}
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors focus-ring"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ParentDashboard;