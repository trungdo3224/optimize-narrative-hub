import React from 'react';
import Header from '@/components/Header';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Your Profile
        </h1>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <p className="text-gray-700 dark:text-gray-200">
            This is your profile page. You can view your profile information here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
