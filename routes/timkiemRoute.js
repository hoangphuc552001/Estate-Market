import express from "express";
import estateModels from "../models/estate.models.js";

const router=express.Router();
router.get("/",async function (req,res){
    const key=req.query.keyword.trim()
    const type=req.query.type_.trim()
    const ward= req.query.ward.trim()
    const bedroom=req.query.bedroom.trim()
    const bathroom=req.query.bathroom.trim()
    const price = req.query.price.trim().split(" - ");
    const minprice=price[0].trim()
    const maxprice=price[1].trim()
    var page=+req.query.page||1
    if (page<0) page=1
    const offset=(page-1)*9
    let [list,total] =await Promise.all([
        estateModels.searchFullText(key,ward,type,bedroom,bathroom, minprice,maxprice,9,offset),
        estateModels.searchFullTextTotal(key,ward,type,bedroom,bathroom, minprice,maxprice),
    ]);
    res.render("product/search-grid",{
        productByCatID:list,
        numberPage:Math.ceil(total.length/9),
        currentPage:page,
        keyword:key,
        type:type,
        ward,
        bedroom,
        bathroom,
        price:req.query.price
    })
})
export default router;
