import React, { useContext } from 'react'
import Nav from '../Component/Nav'
import Card from '../Component/Card';
import { listingDataContext } from '../Context/ListingContext';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

function Home() {
  let {listingData,setListingData,newListData}=useContext(listingDataContext)

  return (
    <div className='bg-gradient-to-br from-gray-50 via-white to-red-50 min-h-screen'>
     <Nav/>

     {/* Hero Section */}
     <div className='w-full pt-[180px] md:pt-[150px] pb-16 px-4'>
       <div className='max-w-7xl mx-auto'>
         {/* Hero Text */}
         <div className='text-center mb-12 animate-fadeIn'>
           <h1 className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-600 via-pink-600 to-red-500 bg-clip-text text-transparent leading-tight'>
             Find Your Perfect Stay
           </h1>
           <p className='text-xl md:text-2xl text-gray-600 mb-4'>
             Discover amazing places to stay
           </p>
         </div>

         {/* Section Title */}
         <div className='mb-8'>
           <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>
             Explore Our Collection
           </h2>
           <p className='text-gray-600 text-lg'>
             {newListData.length} amazing properties waiting for you
           </p>
         </div>
       </div>
     </div>

     {/* Properties Grid */}
     <div className='max-w-[1800px] mx-auto px-4 pb-20'>
       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center'>
         {newListData.map((list, index)=>(
           <div
             key={list._id}
             className='animate-fadeInUp'
             style={{ animationDelay: `${index * 0.05}s` }}
           >
             <Card
               title={list.title}
               landMark={list.landMark}
               city={list.city}
               image1={list.image1}
               image2={list.image2}
               image3={list.image3}
               rent={list.rent}
               id={list._id}
               ratings={list.ratings}
               isBooked={list.isBooked}
               host={list.host}
               availableQuantity={list.availableQuantity}
               totalQuantity={list.totalQuantity}
             />
           </div>
         ))}
       </div>

       {/* Empty State */}
       {newListData.length === 0 && (
         <div className='text-center py-20'>
           <div className='w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center'>
             <FaMapMarkerAlt className='text-6xl text-red-400' />
           </div>
           <h3 className='text-2xl font-bold text-gray-700 mb-2'>No properties found</h3>
           <p className='text-gray-500'>Try adjusting your search or filters</p>
         </div>
       )}
     </div>

     {/* Add Custom Animations */}
     <style>{`
       @keyframes fadeIn {
         from { opacity: 0; transform: translateY(-20px); }
         to { opacity: 1; transform: translateY(0); }
       }
       @keyframes fadeInUp {
         from { opacity: 0; transform: translateY(30px); }
         to { opacity: 1; transform: translateY(0); }
       }
       .animate-fadeIn {
         animation: fadeIn 0.8s ease-out;
       }
       .animate-fadeInUp {
         animation: fadeInUp 0.6s ease-out both;
       }
     `}</style>
    </div>
  )
}

export default Home
