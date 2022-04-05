import express from "express";

const router=express.Router();
router.get('/profile',(req,res)=>{
    res.render('user/profile',{

    })
})

export default router;