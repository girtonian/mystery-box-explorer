/**
 * Collection page placeholder - NFT collection and progress display
 * Will be implemented in later steps
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, Gift, ArrowLeft } from 'lucide-react';

const Collection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-primary">
          My Story Collection
        </h1>
        <p className="text-lg text-gray-600">
          Your collected adventures and achievements
        </p>
      </div>

      {/* Collection stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 font-primary">0</h3>
          <p className="text-gray-600">Stories Collected</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 font-primary">0</h3>
          <p className="text-gray-600">Achievements</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 font-primary">0</h3>
          <p className="text-gray-600">NFT Collectibles</p>
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl p-12 shadow-soft text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Star className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 font-primary">
          Start Your Collection
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Scan your first Curmunchkin attachment to unlock stories and start building your magical collection!
        </p>
        <Link
          to="/scanner"
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors focus-ring"
        >
          <Star className="h-5 w-5 mr-2" />
          Scan First Attachment
        </Link>
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

export default Collection;