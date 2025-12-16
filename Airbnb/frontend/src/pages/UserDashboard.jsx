import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';
import { bookingDataContext } from '../Context/BookingContext';
import { authDataContext } from '../Context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHeart, FaHome, FaCalendarCheck, FaUser, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Card from '../Component/Card';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, getCurrentUser } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const { handleViewCard, refreshTrigger } = useContext(listingDataContext);
  const { cancelBooking } = useContext(bookingDataContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [userBookings, setUserBookings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refresh user data when refreshTrigger changes or when navigating to this page
  useEffect(() => {
    if (userData && userData.role === 'admin') {
      navigate('/admin');
      return;
    }

    if (userData) {
      getCurrentUser();
    }
  }, [refreshTrigger, location.pathname]);

  useEffect(() => {
    if (userData && userData.role === 'admin') {
      navigate('/admin');
      return;
    }

    fetchUserData();
  }, [userData]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Use bookings directly from userData (already populated)
      if (userData?.booking && userData.booking.length > 0) {
        setUserBookings(userData.booking);
      } else {
        setUserBookings([]);
      }

      // Use listings directly from userData
      if (userData?.listing && userData.listing.length > 0) {
        setUserListings(userData.listing);
      } else {
        setUserListings([]);
      }

      // Fetch favorites if they exist
      if (userData?.favorites && userData.favorites.length > 0) {
        const favoritePromises = userData.favorites.map(favId =>
          axios.get(`${serverUrl}/api/listing/findlistingbyid/${favId}`, { withCredentials: true })
        );
        const favoriteResponses = await Promise.all(favoritePromises);
        setFavorites(favoriteResponses.map(res => res.data.listing));
      } else {
        setFavorites([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId) => {
    try {
      await axios.post(`${serverUrl}/api/user/removefavorite/${listingId}`, {}, { withCredentials: true });
      setFavorites(favorites.filter(fav => fav._id !== listingId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {userData?.name}!</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* My Bookings */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">My Bookings</p>
                <h3 className="text-4xl font-bold mt-2">{userBookings.length}</h3>
              </div>
              <FaCalendarCheck className="text-5xl text-green-200" />
            </div>
          </div>

          {/* Favorites */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Favorites</p>
                <h3 className="text-4xl font-bold mt-2">{favorites.length}</h3>
              </div>
              <FaHeart className="text-5xl text-pink-200" />
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
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'border-b-3 border-red-500 text-red-500 bg-red-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'border-b-3 border-red-500 text-red-500 bg-red-50/50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              Favorites
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Account Overview</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Info */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{userData?.name}</h3>
                      <p className="text-gray-600">{userData?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-semibold">Role:</span> {userData?.role || 'User'}</p>
                    <p className="text-gray-700"><span className="font-semibold">Member since:</span> {new Date(userData?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/')}
                      className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                    >
                      Explore Properties
                    </button>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                    >
                      View My Bookings
                    </button>
                    <button
                      onClick={() => setActiveTab('favorites')}
                      className="w-full px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-semibold"
                    >
                      View Favorites
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Activity Summary</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">Total bookings made: <span className="font-bold text-green-500">{userBookings.length}</span></p>
                  <p className="text-gray-700">Properties in wishlist: <span className="font-bold text-pink-500">{favorites.length}</span></p>
                  <p className="text-gray-700">Account status: <span className="font-bold text-blue-500">Active</span></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
              {userBookings.length === 0 ? (
                <div className="text-center py-12">
                  <FaCalendarCheck className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No bookings yet</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Explore Properties
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userBookings.map((booking) => (
                    <Card
                      key={booking._id}
                      title={booking.title}
                      landMark={booking.landMark}
                      city={booking.city}
                      image1={booking.image1}
                      image2={booking.image2}
                      image3={booking.image3}
                      rent={booking.rent}
                      id={booking._id}
                      isBooked={booking.isBooked}
                      ratings={booking.ratings}
                      host={booking.host}
                      availableQuantity={booking.availableQuantity}
                      totalQuantity={booking.totalQuantity}
                    />
                  ))}
                </div>
              )}
            </div>
          )}


          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Favorites</h2>
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No favorites yet</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Explore Properties
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favorites.map((listing) => (
                    <Card
                      key={listing._id}
                      title={listing.title}
                      landMark={listing.landMark}
                      city={listing.city}
                      image1={listing.image1}
                      image2={listing.image2}
                      image3={listing.image3}
                      rent={listing.rent}
                      id={listing._id}
                      isBooked={listing.isBooked}
                      ratings={listing.ratings}
                      host={listing.host}
                      availableQuantity={listing.availableQuantity}
                      totalQuantity={listing.totalQuantity}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
