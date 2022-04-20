import express from "express";
import userModel from "../models/user.model.js";
import estateModels from "../models/estate.models.js";
import estateModel from "../models/estate.models.js";

const router=express.Router();
let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/authen/login");
    }
    next();
};

router.get('/profile',checkLoggedIn,async (req,res)=>{
    if (res.locals.user){
        const user=await userModel.findUserByID(res.locals.user.id)
        const listPro=await estateModels.findProDuctOwnedByUser(res.locals.user.id)
        let pro=await estateModel.findProDuctOwnedByUserByTop(res.locals.user.id,9,0)
        res.render('user/profile',{
            userInfor:user[0],
            firstName:res.locals.user.firstName,
            listPro:pro,
            currentPage:1,
            totalOfPages:Math.ceil(listPro.length/9),
            totalPro:listPro.length
        })
    }else{
        res.status(500).send("False")
    }

})
export default router;