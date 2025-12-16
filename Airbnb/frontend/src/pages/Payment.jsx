import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingDataContext } from '../Context/BookingContext';
import { listingDataContext } from '../Context/ListingContext';
import { toast } from 'react-toastify';
import { FaCreditCard, FaLock } from 'react-icons/fa';

const Payment = () => {
  const navigate = useNavigate();
  const { checkIn, checkOut, total, handleBooking } = useContext(bookingDataContext);
  const { cardDetails } = useContext(listingDataContext);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Card number must be 16 digits');
      return;
    }

    if (!cardName.trim()) {
      toast.error('Cardholder name is required');
      return;
    }

    if (expiryDate.replace(/\//g, '').length !== 4) {
      toast.error('Invalid expiry date');
      return;
    }

    if (cvv.length !== 3) {
      toast.error('CVV must be 3 digits');
      return;
    }

    // Mock payment processing
    setProcessing(true);

    // Simulate payment delay
    setTimeout(async () => {
      try {
        // Call the booking API after successful payment
        await handleBooking(cardDetails._id);
        toast.success('Payment successful! Booking confirmed.');
        navigate('/booked');
      } catch (error) {
        toast.error('Booking failed. Please try again.');
        setProcessing(false);
      }
    }, 2000);
  };

  if (!cardDetails || !checkIn || !checkOut) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <FaLock className="text-green-600 text-2xl" />
              <h2 className="text-3xl font-bold text-gray-800">Secure Payment</h2>
            </div>

            <p className="text-gray-600 mb-8">
              This is a mock payment. Enter any card details to complete your booking.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors pl-12"
                    required
                  />
                  <FaCreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition-all transform hover:scale-105 ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay $${total}`
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-gray-500 text-sm">
              <FaLock />
              <span>Your payment information is secure</span>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Booking Summary</h3>

            {/* Property Image */}
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src={cardDetails.image1}
                alt={cardDetails.title}
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Property Details */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xl font-semibold text-gray-800">{cardDetails.title}</h4>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="font-semibold">Location:</span>
                {cardDetails.city}, {cardDetails.landMark}
              </p>
            </div>

            {/* Dates */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span className="font-semibold">{new Date(checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span className="font-semibold">{new Date(checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rent per night</span>
                <span className="font-semibold">${cardDetails.rent}</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-300 mt-6 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-3xl font-bold text-red-500">${total}</span>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-2">Cancellation Policy</h5>
              <p className="text-sm text-gray-600">
                Free cancellation within 24 hours of booking. After that, cancellation fees may apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
