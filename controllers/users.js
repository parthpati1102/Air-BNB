const User = require("../models/user")

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
}


module.exports.signupUser = async(req,res,next) => {
    try{
        let {username,email,password} = req.body;
    let newUser = new User({username,email});
    const registeredUser = await User.register(newUser , password);

    req.login(registeredUser , (err) => {
         if(err){
            return next(err);
         }

         req.flash("success" , `Hello ${username} ,Welcome to Wanderlust!`);
         res.redirect("/listings");
    })
    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }

}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.userLogin = async(req,res)=> {
    let {username} = req.body;
  req.flash("success" , `Hello ${username} , Welcome Back to Wanderlust`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
}

module.exports.userLogout = (req,res,next) => {
    req.logout((err) => {

        if(err){
            return next(err);
        }

        req.flash("success" , "You are Logged Out!");
        res.redirect("/listings");
    })
}