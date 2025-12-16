import Booking from "../model/booking.model.js"
import Listing from "../model/listing.model.js"
import User from "../model/user.model.js"

export const createBooking = async (req,res) => {
   try {
    let {id} = req.params
    let {checkIn ,checkOut ,totalRent} = req.body

    let listing = await Listing.findById(id)
    if(!listing){
        return res.status(404).json({message:"Listing is not found"})
    }
    if (new Date(checkIn) >= new Date(checkOut)){
        return res.status(400).json({message:"Invaild checkIn/checkOut date"})

    }

    // Check if listing has available quantity
    if(listing.availableQuantity <= 0){
        return res.status(400).json({message:"Listing is fully booked"})
    }

    let booking = await Booking.create({
        checkIn,
        checkOut,
        totalRent,
        host:listing.host,
        guest:req.userId,
        listing:listing._id
    })
    await booking.populate("host", "email" );
    let user = await User.findByIdAndUpdate(req.userId,{
        $push:{booking:listing._id}
    },{new:true}).populate("booking")
    if(!user){
        return res.status(404).json({message:"User is not found"})
    }

    // Decrement available quantity
    listing.availableQuantity -= 1

    // Mark as booked only if no more available
    if(listing.availableQuantity === 0) {
        listing.isBooked = true
    }

    // Set guest to the most recent guest
    listing.guest = req.userId
    await listing.save()
    return res.status(201).json(booking)

   } catch (error) {

    return res.status(500).json({message:`booking error ${error}`})
   }

}
export const cancelBooking = async (req,res) => {
    try {
        let {id} = req.params
        let listing = await Listing.findById(id)

        if(!listing){
            return res.status(404).json({message:"Listing is not found"})
        }

        // Increment available quantity
        listing.availableQuantity += 1

        // Unmark as booked
        listing.isBooked = false

        await listing.save()

        let user = await User.findByIdAndUpdate(listing.guest,{
            $pull:{booking:listing._id}
        },{new:true})

        if(!user){
            return res.status(404).json({message:"user is not found"})
        }

        return res.status(200).json({message:"booking cancelled"})

    } catch (error) {
        return res.status(500).json({message:"booking cancel error"})
    }

}