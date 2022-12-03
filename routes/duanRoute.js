import express from "express";
import estateModel from '../models/estate.models.js'
import categoryModel from '../models/category.models.js'
import dateFormat from "dateformat";
const router=express.Router();

router.get('/',async function (req,res){
    const proByParentCat= await estateModel.findProByCatParentID(3)
    const parentName= await categoryModel.findCatParentByID(3);
    proByParentCat.start=dateFormat(proByParentCat.start,"yyyy-mm-dd h:MM:ss")
    res.render('product/blog-grib',{
        productByCatID:proByParentCat,
        catIDProduct:parentName[0]
    });
   /* res.send({productByCatID:proByParentCat,
        catIDProduct:parentName[0]})*/
});
router.get('/:detailID',async function (req,res){
    console.log(req.params.detailID)
    const pro=await estateModel.findDetailProByID(req.params.detailID||0);
    console.log(pro[0]);
   /* res.send({ pro:pro[0]})*/
    res.render('product/blog-single',{
        pro:pro[0]
    })
});
export default router;