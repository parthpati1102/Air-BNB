const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
      type:  String,
      default: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      set : (v) => v === "" ? "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price : Number,
    location : String,
    // Country : String
})
// delete ListingSchema.obj.Country;
ListingSchema.add({
   country : String,
})

const Listing = new mongoose.model('Listing' , ListingSchema);
module.exports = Listing;