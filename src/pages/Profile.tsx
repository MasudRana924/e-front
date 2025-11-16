import React, { useEffect, useState } from 'react';
import { useUser } from '../redux/features/user/user.api';
import { toast } from 'sonner';

// Profile Skeleton Loader Component
const ProfileSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-6"></div>
        <div className="bg-card shadow-md rounded-lg p-6 border border-border">
          <div className="h-6 bg-muted rounded w-40 mb-6"></div>
          
          {/* Name Field Skeleton */}
          <div className="mb-4">
            <div className="h-4 bg-muted rounded w-16 mb-2"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
          
          {/* Email Field Skeleton */}
          <div className="mb-4">
            <div className="h-4 bg-muted rounded w-12 mb-2"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
          
          {/* Phone Field Skeleton */}
          <div className="mb-4">
            <div className="h-4 bg-muted rounded w-24 mb-2"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-48 mt-1"></div>
          </div>
          
          {/* NID Field Skeleton */}
          <div className="mb-6">
            <div className="h-4 bg-muted rounded w-8 mb-2"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-32 mt-1"></div>
          </div>
          
          {/* Save Button Skeleton */}
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
      </div>
    </div>
  );
};
const Profile = () => {
  const { getUserProfile, updateProfile, user, loading, error } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    nid: ''
  });
  useEffect(() => {
    getUserProfile();
  }, [getUserProfile]);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        nid: user.nid || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow changes to name and email fields
    if (name === 'name' || name === 'email') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email
      });

      // Show success toast
      toast.success('Profile updated successfully!');

      // Refresh user data
      getUserProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      // Show error toast
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  if (loading) {
    return <ProfileSkeleton />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Profile Page</h1>
      {user ? (
        <div className="bg-card shadow-md rounded-lg p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Profile Information</h2>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                className="w-full p-2 border border-input rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                readOnly
                disabled
              />
              <p className="text-sm text-muted-foreground">Phone number cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">NID:</label>
              <input
                type="text"
                name="nid"
                value={formData.nid}
                className="w-full p-2 border border-input rounded-md bg-muted text-muted-foreground cursor-not-allowed"
                readOnly
                disabled
              />
              <p className="text-sm text-muted-foreground">NID cannot be changed</p>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isUpdating}
                className={`px-4 py-2 rounded text-white flex items-center space-x-2 ${isUpdating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                  }`}
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default Profile;
