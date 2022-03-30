import express from "express";
import estateModels from "../models/estate.models.js";

const router=express.Router();
router.get("/",async function (req,res){
    const key=req.query.keyword
    const type=req.query.type
    const ward= req.query.ward
    const bedroom=req.query.bedroom
    const bathroom=req.query.bathroom
    const listKey=await estateModels.searchFullText(key)
    res.render('property-grid',{
        productByCatID:listKey
    })
})

export default router;