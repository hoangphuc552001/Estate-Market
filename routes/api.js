import express from "express";
import estateModels from "../models/estate.models.js";
import categoryModels from "../models/category.models.js";
import cors from 'cors'
const router=express.Router();

router.get("/user",async (req,res,next)=>{
    const arr=await estateModels.findByEstateID(1)
    return res.status(200).json(arr)
})
router.post("/addcat",async (req,res)=>{
    try{
        const name=req.body.name
        const parent=req.body.parent
        if (!name || !parent) return res.status(200).json({
            message:"missing required params"
        })
        const cat={
            name,
            parent
        }
        await categoryModels.insertCat(cat)
        if (!name || !parent) return res.status(200).json({
            message:"ok"
        })
    }catch (e){
        return res.status(200).json({
            message:e
        })
    }

})

export default router
