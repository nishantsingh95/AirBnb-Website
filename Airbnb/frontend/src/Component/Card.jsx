import React, { useContext } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listingDataContext } from '../Context/ListingContext'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { useState } from 'react';
import { bookingDataContext } from '../Context/BookingContext';
import { authDataContext } from '../Context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Card({ title, landMark, image1, image2, image3, rent, city, id, ratings, isBooked, host, availableQuantity, totalQuantity }) {
    let navigate = useNavigate()
    let { userData } = useContext(userDataContext)
    let { handleViewCard } = useContext(listingDataContext)
    let [popUp, setPopUp] = useState(false)
    let {cancelBooking}=useContext(bookingDataContext)
    let { serverUrl } = useContext(authDataContext)
    let [isFavorite, setIsFavorite] = useState(userData?.favorites?.includes(id) || false)
    let [currentImageIndex, setCurrentImageIndex] = useState(0)

    const images = [image1, image2, image3]

    const handleClick = () => {
        if (userData) {
            handleViewCard(id)
        }
        else {
            navigate("/login")
        }
    }

    const handleFavoriteToggle = async (e) => {
        e.stopPropagation()

        if (!userData) {
            navigate("/login")
            return
        }

        try {
            if (isFavorite) {
                await axios.post(`${serverUrl}/api/user/removefavorite/${id}`, {}, { withCredentials: true })
                setIsFavorite(false)
                toast.success('Removed from favorites')
            } else {
                await axios.post(`${serverUrl}/api/user/addfavorite/${id}`, {}, { withCredentials: true })
                setIsFavorite(true)
                toast.success('Added to favorites')
            }
        } catch (error) {
            toast.error('Failed to update favorites')
        }
    }

    const nextImage = (e) => {
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = (e) => {
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <div
            className='w-full max-w-[350px] h-[480px] flex flex-col rounded-3xl cursor-pointer relative overflow-hidden group bg-white shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2'
            onClick={() => !isBooked ? handleClick() : null}
        >
            {/* Status Badges */}
            {isBooked && (
                <div className='absolute top-4 left-4 z-30 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg backdrop-blur-sm'>
                    <GiConfirmed className='w-4 h-4' />
                    Fully Booked
                </div>
            )}
            {!isBooked && availableQuantity && totalQuantity && (
                <div className='absolute top-4 left-4 z-30 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm'>
                    {availableQuantity}/{totalQuantity} Available
                </div>
            )}
            {isBooked && host == userData?._id && userData?.role !== 'admin' && (
                <button
                    className='absolute top-16 left-4 z-30 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg hover:bg-red-600 transition'
                    onClick={(e) => {e.stopPropagation(); setPopUp(true)}}
                >
                    <FcCancel className='w-4 h-4' />
                    Cancel
                </button>
            )}

            {/* Favorite Button with Enhanced Design */}
            <button
                onClick={handleFavoriteToggle}
                className='absolute top-4 right-4 z-30 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/50'
            >
                {isFavorite ? (
                    <FaHeart className='text-red-500 text-xl animate-pulse' />
                ) : (
                    <FaRegHeart className='text-gray-700 text-xl group-hover:text-red-500 transition-colors' />
                )}
            </button>

            {/* Cancel Popup with Modern Design */}
            {popUp && (
                <div className='absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-6' onClick={(e) => e.stopPropagation()}>
                    <div className='bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform scale-100 animate-scaleIn'>
                        <h3 className='text-2xl font-bold text-gray-800 mb-4'>Cancel Booking?</h3>
                        <p className='text-gray-600 mb-6'>Are you sure you want to cancel this booking? This action cannot be undone.</p>
                        <div className='flex gap-4'>
                            <button
                                className='flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105'
                                onClick={(e) => {e.stopPropagation(); cancelBooking(id); setPopUp(false)}}
                            >
                                Yes, Cancel
                            </button>
                            <button
                                className='flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition'
                                onClick={(e) => {e.stopPropagation(); setPopUp(false)}}
                            >
                                Keep It
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Section with Enhanced Slider */}
            <div className='relative w-full h-[280px] overflow-hidden rounded-t-3xl'>
                {/* Images Container */}
                <div className='absolute inset-0 transition-transform duration-700 ease-in-out' style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    <div className='flex h-full'>
                        {images.map((img, idx) => (
                            <div key={idx} className='w-full h-full flex-shrink-0 relative'>
                                <img
                                    src={img}
                                    alt={`${title} ${idx + 1}`}
                                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons with Better Design */}
                <button
                    onClick={prevImage}
                    className='absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 z-20'
                >
                    <span className='text-gray-800 text-xl font-bold'>‹</span>
                </button>
                <button
                    onClick={nextImage}
                    className='absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 z-20'
                >
                    <span className='text-gray-800 text-xl font-bold'>›</span>
                </button>

                {/* Enhanced Image Indicators */}
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {e.stopPropagation(); setCurrentImageIndex(index)}}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentImageIndex
                                    ? 'w-8 bg-white shadow-lg'
                                    : 'w-2 bg-white/60 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content Section with Modern Typography */}
            <div className='flex-1 p-5 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50'>
                <div>
                    <div className='flex items-start justify-between mb-2'>
                        <h3 className='text-lg font-bold text-gray-800 line-clamp-1 flex-1'>
                            {title}
                        </h3>
                        <div className='flex items-center gap-1 ml-2 bg-gradient-to-r from-yellow-400 to-yellow-500 px-2 py-1 rounded-lg shadow-sm'>
                            <FaStar className='text-white text-sm' />
                            <span className='text-sm font-bold text-white'>{ratings || 4.5}</span>
                        </div>
                    </div>

                    <p className='text-gray-600 text-sm mb-3 line-clamp-1 flex items-center gap-1'>
                        <span className='text-red-500'>📍</span>
                        {landMark}, {city}
                    </p>
                </div>

                <div className='flex items-center justify-between pt-3 border-t border-gray-200'>
                    <div>
                        <p className='text-gray-500 text-xs mb-1'>From</p>
                        <p className='text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent'>
                            ₹{rent}
                        </p>
                        <p className='text-gray-500 text-xs'>per night</p>
                    </div>
                    <button
                        className='px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105'
                        onClick={handleClick}
                    >
                        View Details
                    </button>
                </div>
            </div>

            {/* Add Scale Animation */}
            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default Card
