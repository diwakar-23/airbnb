if (process.env.NODE_ENV != "production")  {
  require('dotenv').config();

}

// const MongoStore = require('connect-mongo');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
// const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

//router path
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")




// const MONGO_URL = "mongodb://127.0.0.1:27017/airbnnbb";
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
// async function main() {
//   try {
//     if (!dbUrl) {
//       console.error("Error: dbUrl is undefined. Check your .env file.");
//       return;
//     }
//     await mongoose.connect(dbUrl);
//     console.log("Connected to MongoDB successfully");
//   } catch (err) {
//     console.error("MongoDB Connection Error: ", err);
//   }
// }

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));


// const secret = "mysecretcode";
// console.log(dbUrl);
// console.log("Database URL found:", dbUrl ? "Yes (Hidden for security)" : "NO - Check .env file");
// const store = MongoStore.create({
//   mongoUrl:dbUrl,
//   crypto:{
//     secret:"secret",
//     // secret: process.env.SECRET || "mysupersceretcode",
//   },
//   touchAfter:24*3600,
// });

// store.on("error",()=>{
//   console.log("ERROR in MONGO SESSION STORE",err);
// });

const sessionOptions = {
  // store,
  secret: process.env.SECRET, // use a better secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // cookie expires in 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // for security
    // secure: true  // uncomment in production (requires HTTPS)
  }
};



app.use(session(sessionOptions));
app.use(flash()); //always use before using route

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser= req.user;
  next();
})

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email : "dwoke@gmail.com",
//     username :"dwoke"
//   });
//  let registeredUser = await User.register(fakeUser,"dwoke");
//  res.send(registeredUser);
// });

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter)



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
  if (res.headersSent) {
    return next(err);
  }
  let {statusCode=500, message="Something Went Wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});

  // res.status(statusCode).send(message);
})

app.listen(3000, () => {
  console.log("server is listening to port 3000");
});

module.exports = app;
