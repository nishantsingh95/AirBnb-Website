import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';
import { authDataContext } from '../Context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUsers, FaHome, FaCalendarCheck, FaChartLine, FaTrash, FaEye } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { refreshTrigger } = useContext(listingDataContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    revenue: 0
  });
  const [allUsers, setAllUsers] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Refresh when navigating to this page or when refreshTrigger changes
  useEffect(() => {
    // Redirect if not admin
    if (userData && userData.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchAdminData();
  }, [userData, location.pathname, refreshTrigger]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all users
      const usersRes = await axios.get(`${serverUrl}/api/admin/users`, { withCredentials: true });
      setAllUsers(usersRes.data.users || []);

      // Fetch all listings
      const listingsRes = await axios.get(`${serverUrl}/api/listing/get`, { withCredentials: true });
      setAllListings(listingsRes.data || []);

      // Fetch all bookings
      const bookingsRes = await axios.get(`${serverUrl}/api/admin/bookings`, { withCredentials: true });
      setAllBookings(bookingsRes.data.bookings || []);

      // Calculate stats
      const totalRevenue = (bookingsRes.data.bookings || []).reduce((sum, booking) => sum + booking.totalRent, 0);

      setStats({
        totalUsers: usersRes.data.users?.length || 0,
        totalListings: listingsRes.data?.length || 0,
        totalBookings: bookingsRes.data.bookings?.length || 0,
        revenue: totalRevenue
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
      // If endpoints don't exist, we'll show mock data
      setStats({
        totalUsers: 0,
        totalListings: 0,
        totalBookings: 0,
        revenue: 0
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${serverUrl}/api/admin/user/${userId}`, { withCredentials: true });
        toast.success('User deleted successfully');
        fetchAdminData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`${serverUrl}/api/listing/delete/${listingId}`, { withCredentials: true });
        toast.success('Listing deleted successfully');
        fetchAdminData();
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {userData?.name}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <h3 className="text-4xl font-bold mt-2">{stats.totalUsers}</h3>
              </div>
              <FaUsers className="text-5xl text-blue-200" />
            </div>
          </div>

          {/* Total Listings */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Listings</p>
                <h3 className="text-4xl font-bold mt-2">{stats.totalListings}</h3>
              </div>
              <FaHome className="text-5xl text-green-200" />
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Bookings</p>
                <h3 className="text-4xl font-bold mt-2">{stats.totalBookings}</h3>
              </div>
              <FaCalendarCheck className="text-5xl text-purple-200" />
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Total Revenue</p>
                <h3 className="text-4xl font-bold mt-2">${stats.revenue}</h3>
              </div>
              <FaChartLine className="text-5xl text-pink-200" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg mb-6 border border-gray-200/50">
          <div className="flex border-b border-gray-200/50 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-b-3 border-red-500 text-red-500 bg-red-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-b-3 border-red-500 text-red-500 bg-red-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              Users ({allUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === 'listings'
                  ? 'border-b-3 border-red-500 text-red-500 bg-red-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              Listings ({allListings.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'border-b-3 border-red-500 text-red-500 bg-red-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              Bookings ({allBookings.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Platform Overview</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <p className="text-gray-600">Total platform revenue: <span className="font-bold text-red-500">${stats.revenue}</span></p>
                  <p className="text-gray-600 mt-2">Active listings: <span className="font-bold">{stats.totalListings}</span></p>
                  <p className="text-gray-600 mt-2">Registered users: <span className="font-bold">{stats.totalUsers}</span></p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full mb-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => setActiveTab('listings')}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Manage Listings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>
              {allUsers.length === 0 ? (
                <p className="text-gray-600">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Listings</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role || 'user'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.listing?.length || 0}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-800"
                              disabled={user.role === 'admin'}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'listings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">All Listings</h2>
              {allListings.length === 0 ? (
                <p className="text-gray-600">No listings found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allListings.map((listing) => (
                    <div key={listing._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                      <img
                        src={listing.image1}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-800 truncate">{listing.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{listing.city}, {listing.landMark}</p>
                        <p className="text-red-500 font-bold mt-2">${listing.rent}/night</p>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => {
                              // Navigate to view listing
                              navigate('/viewcard');
                            }}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                          >
                            <FaEye className="inline mr-2" />
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">All Bookings</h2>
              {allBookings.length === 0 ? (
                <p className="text-gray-600">No bookings found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Listing</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Guest</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-in</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-out</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allBookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">{booking.listing?.title || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{booking.guest?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">${booking.totalRent}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'booked' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
