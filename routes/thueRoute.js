import express from "express";
import estateModel from '../models/estate.models.js'
import categoryModel from '../models/category.models.js'
import commentModel from "../models/comment.model.js";
const router=express.Router();

router.get('/',async function (req,res){
    const pro= await estateModel.findPageParent(2,9,0)
    const parentName=await categoryModel.findCatParentByID(2)
    let proParent=await estateModel.findProByCatParentID(2)
    res.render('product/property-grid',{
        productByCatID:pro,
        catIDProduct:parentName[0],
        totalOfPages:Math.ceil(proParent.length/9),
        currentPage:1,
        type:2,
        noti:"parent/",
    })
});
router.get('/:estateID',async function (req,res){
    const catID=req.params.estateID||0
    const pro=await estateModel.findPage(9,0,catID)
    const proParent=await estateModel.findByEstateID(catID)
    const catIDProduct=await categoryModel.findCatByID(catID)
    const catParentProduct=await categoryModel.findCatParentByID(2)
    res.render('product/property-grid',{
        productByCatID:pro,
        catIDProduct:catIDProduct[0],
        catParentIDProduct:catParentProduct[0],
        totalOfPages:Math.ceil(proParent.length/9),
        currentPage:1,
        type:2,
        noti:"child/",
    })
});
router.get('/:estateID/:detailID',async function (req,res){
    const pro=await estateModel.findDetailProByID(req.params.detailID||0)
    const listRelatedPro=await estateModel.findProTopByEstateID(req.params.estateID||0,5)
    const listProjectPro=await  estateModel.findProByCatParentID(3)
    const listNewPro=await  estateModel.findProByCatParentID(4)
    const userOwned=await estateModel.findUserByProductOwned(req.params.detailID||0)
    const comment=await commentModel.findAllCommentWithUser(req.params.detailID)
    listRelatedPro.forEach(i=>{
        i.parentID=2;
    })
    res.render('product/prop-single',{
        pro:pro[0],
        listRelatedPro,
        listProjectPro,
        listNewPro,
        userInfor:userOwned[0],
        comment
    })
});
export default router;