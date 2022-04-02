import express from "express";
const router=express.Router();
router.get("/",(req,res)=>{
    res.render("authentication/signin",{
        layout:false
    })
})
export default router;