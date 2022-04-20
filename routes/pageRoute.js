import estateModel from "../models/estate.models.js";
import express from "express";
import estateModels from "../models/estate.models.js";
const router=express.Router();
router.get("/profile/:iduser/:pageID",async (req,res)=>{
    const id=req.params.iduser||0
    let currentPage=req.params.pageID
    let offset_=(parseInt(currentPage)-1)*9
    let pro=await estateModel.findProDuctOwnedByUserByTop(id,9,offset_)
    let proList=await estateModel.findProDuctOwnedByUser(id)
    res.render("product/profileProductLayout",{
        layout:false,
        listPro:pro,
        totalOfPages:Math.ceil(proList.length/9)
    })
})
router.get("/:parentID/parent/1/:pageID", async (req,res)=>{
    let currentPage=req.params.pageID
    let catParentID=req.params.parentID
    let offset_=(parseInt(currentPage)-1)*9
    let pro=await estateModel.findPageParent(9,offset_,catParentID)
    const proParent=await estateModel.findProByCatParentID(catParentID)
    res.render("product/performListPro",{
        layout:false,
        productByCatID:pro,
        totalOfPages:Math.ceil(proParent.length/9),
    })
})
router.get("/1/child/:CatID/:pageID", async (req,res)=>{
    let currentPage=req.params.pageID
    let catID=req.params.CatID
    let offset_=(parseInt(currentPage)-1)*9
    let pro=await estateModel.findPage(9,offset_,catID)
    const proParent=await estateModel.findProByCatParentID(catID)
    res.render("product/performListPro",{
        layout:false,
        productByCatID:pro,
        totalOfPages:Math.ceil(proParent.length/9),
    })
})
router.get("/:parentID/parent/2/:pageID", async (req,res)=>{
    let currentPage=req.params.pageID
    let catParentID=req.params.parentID
    let offset_=(parseInt(currentPage)-1)*9
    let pro=await estateModel.findPageParent(9,offset_,catParentID)
    const proParent=await estateModel.findProByCatParentID(catParentID)
    res.render("product/performListPro",{
        layout:false,
        productByCatID:pro,
        totalOfPages:Math.ceil(proParent.length/9),
    })
})
router.get("/2/child/:CatID/:pageID", async (req,res)=>{
    let currentPage=req.params.pageID
    let catID=req.params.CatID
    let offset_=(parseInt(currentPage)-1)*9
    let pro=await estateModel.findPage(9,offset_,catID)
    const proParent=await estateModel.findProByCatParentID(catID)
    res.render("product/performListPro",{
        layout:false,
        productByCatID:pro,
        totalOfPages:Math.ceil(proParent.length/9),
    })
})

export default router;