import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCalendarCheck } from "react-icons/fa";
import { userDataContext } from '../Context/UserContext';
import Card from '../Component/Card';

function MyBooking() {
    let navigate = useNavigate()
    let {userData} = useContext(userDataContext)

  return (
    <div className='min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pt-20'>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent'>
              My Bookings
            </h1>
            <p className="text-gray-600 mt-2">View and manage your property bookings</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className='px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold'
          >
            Back to Home
          </button>
        </div>

        {/* Bookings Content */}
        <div className='bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200/50'>
          {!userData?.booking || userData.booking.length === 0 ? (
            <div className="text-center py-16">
              <FaCalendarCheck className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">No bookings yet</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
              >
                Explore Properties
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {userData.booking.map((list) => (
                <Card
                  key={list._id}
                  title={list.title}
                  landMark={list.landMark}
                  city={list.city}
                  image1={list.image1}
                  image2={list.image2}
                  image3={list.image3}
                  rent={list.rent}
                  id={list._id}
                  isBooked={list.isBooked}
                  ratings={list.ratings}
                  host={list.host}
                  availableQuantity={list.availableQuantity}
                  totalQuantity={list.totalQuantity}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyBooking
