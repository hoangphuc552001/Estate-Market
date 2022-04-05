import express from "express";
import estateModel from '../models/estate.models.js'
import categoryModel from '../models/category.models.js'
import bcrypt from "bcrypt";
import dateFormat from "dateformat";
const router=express.Router();

router.get('/',async function (req,res){
    const proByParentCat= await estateModel.findProByCatParentID(4)
    const parentName= await categoryModel.findCatParentByID(4);
    proByParentCat.start=dateFormat(proByParentCat.start,"yyyy-mm-dd h:MM:ss")

    res.render('product/new-grib',{
        productByCatID:proByParentCat,
        catIDProduct:parentName[0]
    })
});
router.get('/:detailID',async function (req,res){
    const detailID=req.params.detailID||0;
    const pro=await estateModel.findDetailProByID(detailID||0)
    res.render('product/new-single',{
        pro:pro[0]
    })
});
export default router;