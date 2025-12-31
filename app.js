const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/airbnnbb";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));




app.get("/", (req, res) => {
  res.send("Hi, I am root");
});




app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews)



// app.get("/testListing", async (req, res) => {
//    let sampleListing = new Listing({
//      title: "My New Villa",
//      description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//      country: "India",
//    });
//  await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
//  });

// app.all("*",(req,res,next) =>{
//   next(new ExpressError(404,"page not found"));
// } )

// Corrected code
// This is the recommended way to handle 404 errors
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

 app.use((err,req,res,next) =>{
  let {statusCode=500, message="Something Went Wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});

  // res.status(statusCode).send(message);
})

app.listen(3000, () => {
  console.log("server is listening to port 3000");
});
