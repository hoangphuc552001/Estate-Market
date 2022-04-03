import express from "express";
import estateModel from '../models/estate.models.js'
import categoryModel from '../models/category.models.js'
const router=express.Router();

router.get('/',async function (req,res){
    const proByParentCat= await estateModel.findProByCatParentID(2)
    const parentName=await categoryModel.findNameParentByID(2)
    res.render('product/property-grid',{
        productByCatID:proByParentCat,
        catIDProduct:parentName[0],
    })
});
router.get('/:estateID',async function (req,res){
    const catID=req.params.estateID||0;
    const listProductFindByCatID= await estateModel.findByEstateID(catID)
    const catIDProduct=await categoryModel.findCatByID(catID)
    const catParentProduct=await categoryModel.findCatParentByID(catID)
    listProductFindByCatID.forEach(i=>{
        i.parentID=2
    })
    res.render('product/property-grid',{
        productByCatID:listProductFindByCatID,
        catIDProduct:catIDProduct[0],
        catParentIDProduct:catParentProduct[0],
    })
});
router.get('/:estateID/:detailID',async function (req,res){
    const pro=await estateModel.findDetailProByID(req.params.detailID||0)
    const listRelatedPro=await estateModel.findProTopByEstateID(req.params.estateID||0,5)
    const listProjectPro=await  estateModel.findProByCatParentID(3)
    const listNewPro=await  estateModel.findProByCatParentID(4)
    console.log(listProjectPro)
    listRelatedPro.forEach(i=>{
        i.parentID=2;
    })
    res.render('product/prop-single',{
        pro:pro[0],
        listRelatedPro,
        listProjectPro,
        listNewPro
    })
});
export default router;