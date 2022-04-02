import express from "express";
import estateModels from "../models/estate.models.js";

const router=express.Router();
router.get("/",async function (req,res){
    let key=req.query.keyword
    const type=req.query.type_
    const ward= req.query.ward
    let bedroom=req.query.bedroom
    const bathroom=req.query.bathroom
    const price = req.query.price.split(" - ");
    const minprice=price[0]
    const maxprice=price[1]
    const list=await estateModels.searchFullText(key,ward,type,bedroom,bathroom, minprice,maxprice,9,0)
    res.render("product/search-grid",{
        productByCatID:list
    })
})
export default router;
