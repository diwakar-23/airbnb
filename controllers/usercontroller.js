const User = require("../models/user");

module.exports.renderSignupform = (req,res)=>{
    res.render("users/signup.ejs");
};


// module.exports.signup = async(req,res,next)=>{
//     try{
//     let {email,username,password} = req.body;
//     const newUser = new User({email,username});
//     const registeredUser = await User.register(newUser,password);
//     console.log(registeredUser);
    
//     req.login(registeredUser,(err)=>{
//         if(err){
//             return next(err)
//         }
//     req.flash("success"," welcome to wanderlust");
//     res.redirect("/listings")
//     })

//     }catch(e){
//         req.flash("error",e.stack);
//         res.redirect("/signup")
//     }
// };


// module.exports.signup = async (req, res, next) => {
//   try {
//     const { email, username, password } = req.body;
//     const newUser = new User({ email, username });

//     // Use callback form of register to avoid "next is not a function"
//     User.register(newUser, password, (err, registeredUser) => {
//       if (err) {
//         req.flash("error", err.message);
//         return res.redirect("/signup");
//       }

//       req.login(registeredUser, (err) => {
//         if (err) return next(err);
//         req.flash("success", "Welcome to Wanderlust!");
//         res.redirect("/listings");
//       });
//     });
//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("/signup");
//   }
// };



// module.exports.signup = async (req, res, next) => {
//   try {
//     const { email, username, password } = req.body;
//     const newUser = new User({ email, username });

//     const registeredUser = await new Promise((resolve, reject) => {
//       User.register(newUser, password, (err, user) => {
//         if (err) return reject(err);
//         resolve(user);
//       });
//     });

//     await new Promise((resolve, reject) => {
//       req.login(registeredUser, (err) => {
//         if (err) return reject(err);
//         resolve();
//       });
//     });

//     req.flash("success", "Welcome to Wanderlust!");
//     res.redirect("/listings");
//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("/signup");
//   }
// };


// module.exports.signup = async (req, res, next) => {
//   try {
//     const { email, username, password } = req.body;
//     const newUser = new User({ email, username });

//     // isolate registration
//     const registeredUser = await new Promise((resolve, reject) => {
//       User.register(newUser, password, (err, user) => {
//         if (err) return reject(err);
//         resolve(user);
//       });
//     });

//     res.send("User registered successfully: " + registeredUser.username);
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).send(err.stack);
//   }
// };

// module.exports.signup = async (req, res, next) => {
//   try {
//     const { email, username, password } = req.body;
//     const newUser = new User({ email, username });

//     const registeredUser = await new Promise((resolve, reject) => {
//       User.register(newUser, password, (err, user) => {
//         if (err) return reject(err);
//         resolve(user);
//       });
//     });

//     // Automatically log in the new user
//     await new Promise((resolve, reject) => {
//       req.login(registeredUser, (err) => {
//         if (err) return reject(err);
//         resolve();
//       });
//     });

//     req.flash("success", "Welcome to Wanderlust!");
//     res.redirect("/listings"); // ✅ redirect to listings page
//   } catch (err) {
//     console.error("Signup error:", err);
//     req.flash("error", err.message);
//     res.redirect("/signup");
//   }
// };





// module.exports.signup = async (req, res, next) => { // Added next here
//     try {
//         let { email, username, password } = req.body;
//         const newUser = new User({ email, username }); // Added 'new' here
//         const registeredUser = await User.register(newUser, password);
//         req.logIn(registeredUser, (err) => {
//             if (err) return next(err);
//             req.flash("success", "Welcome to Wanderlust");
//             res.redirect("/listings");
//         });
//     } catch (e) {
//         req.flash("error", e.message);
//         res.redirect("/signup");
//     }
// };

module.exports.signup = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        
        // Register returns a promise, so await is correct here
        const registeredUser = await User.register(newUser, password);
        
        // Use req.login (lowercase) - Passport's login still uses a callback
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};



module.exports.renderLoginform = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
        req.flash("success","Welcome ! to wanderlust you are logged in");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };

     module.exports.logout = (req,res,next)=>{
        console.log(req.user);
        req.logout((err)=>{
            if(err){
                return next(err)
            }
        req.flash("success","user logged out");
        res.redirect("/listings")
        })
    };