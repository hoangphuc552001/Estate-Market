import express from "express";
import {validationResult} from "express-validator"
import auth from '../validation/authValidation.js'
import registerService from "../services/registerService.js"
import passport from "passport"
import initPassportLocal from '../middlewares/passport.mdw.js'
const router=express.Router();
initPassportLocal()
let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/authen/login");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.user);
        return res.redirect("/");
    }
    next();
};




let postLogOut = (req, res,next) => {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
};
router.get('/login',checkLoggedOut,(req,res)=>{
    res.render('authentication/signin',{
        layout:false,
        errors:req.flash("errors")
    })
})
router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/authen/login",
    successFlash:true,
    failureFlash:true
}))
router.get('/register',(req,res)=>{
    res.render('authentication/signup',{
        layout:false,
        errors:req.flash("errors")
    })
})
router.post('/register',auth, async (req,res)=>{
    let errorArr=[]
    let validationErrors=validationResult(req)
    if (!validationErrors.isEmpty()){
        let errors=Object.values(validationErrors.mapped())
        errors.forEach((item)=>{
            errorArr.push(item.msg)
        })
        req.flash("errors",errorArr)
        return res.render("authentication/signup",{
            errors:req.flash('errors'),
            layout:false,
        })
    }
    try{
        let newUser={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            permissions:0,
            birthday:req.body.birthday,
            address:req.body.address,
            phone:req.body.phone,
            avatar:"/public/assets/user/default.jpg"
        };
        await registerService.createNewUser(newUser)
        return res.redirect("login")
    }catch (e){
        req.flash("errors",e)
        return res.render("authentication/signup",{
            errors:req.flash('errors'),
            layout:false,
        })
    }
})
router.post('/logout',postLogOut)

export default router;