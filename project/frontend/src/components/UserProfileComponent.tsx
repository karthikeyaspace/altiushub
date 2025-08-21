import React, { useState } from "react";
import { userService, handleApiError, type User } from "../api/services";

const UserProfileComponent: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const userData = await userService.getUserProfile(Number(userId));
      setUser(userData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">User Profile Lookup</h2>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <form onSubmit={fetchUserProfile} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              User ID:
            </label>
            <input
              type="number"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !userId}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium transition-all duration-200 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg self-end"
          >
            {loading ? "Loading..." : "Get User Profile"}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {user && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            User Profile
          </h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-gray-500 w-24">ID:</span>
              <span className="text-gray-900 font-medium">{user.id}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-gray-500 w-24">Username:</span>
              <span className="text-gray-900 font-medium">{user.username}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-gray-500 w-24">Email:</span>
              <span className="text-gray-900 font-medium">{user.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileComponent;
