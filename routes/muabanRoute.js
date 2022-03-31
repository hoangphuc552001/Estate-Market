import express from "express";
import estateModel from '../models/estate.models.js'
import categoryModel from '../models/category.models.js'
const router=express.Router();

router.get('/',async function (req,res){
    const proByParentCat= await estateModel.findProByCatParentID(1)
    const parentName=await categoryModel.findCatParentByID(1)
    res.render('property-grid',{
        productByCatID:proByParentCat,
        catIDProduct:parentName[0]
    })
});
router.get('/:estateID',async function (req,res){
    const catID=req.params.estateID||0;
    const listProductFindByCatID= await estateModel.findByEstateID(catID)
    const catIDProduct=await categoryModel.findCatByID(catID)
    const catParentProduct=await categoryModel.findCatParentByID(catID)
    res.render('property-grid',{
        productByCatID:listProductFindByCatID,
        catIDProduct:catIDProduct[0],
        catParentIDProduct:catParentProduct[0]
    })
});
router.get('/:estateID/:detailID',async function (req,res){
    const pro=await estateModel.findDetailProByID(req.params.detailID||0)
    const listRelatedPro=await estateModel.findProTopByEstateID(req.params.estateID||0,5)
    res.render('prop-single',{
        pro:pro[0],
        listRelatedPro,
    })
});
export default router;