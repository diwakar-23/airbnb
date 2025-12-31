const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type :String,
        required: true,

    },
    description:String,
    Image:{
        type :String,
        default: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
        set: (v) =>
             v === "" ? "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170" : v,
        

    },
    price:Number,
    location : String,
   country:String,
   reviews:[
    {
        type: Schema.Types.ObjectId,
        ref : "Review",
    }
   ]  
});

// Middleware for delete the review while deleting the listing
listingSchema.post("findOneAndDelete",async(listing) =>{
    if (listing) {
         await Review.deleteMany({_id: { $in:listing.reviews }});
    }   
});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;