import express from "express";
import estateModel from '../models/estate.models.js'
import categoryModel from '../models/category.models.js'
import nodemailer from 'nodemailer'
const router=express.Router();

router.get('/',async function (req,res){
    let pro=await estateModel.findPageParent(9,0,1)
    let proParent=await estateModel.findProByCatParentID(1)
    const parentName=await categoryModel.findCatParentByID(1)
    res.render('product/property-grid',{
        productByCatID:pro,
        catIDProduct:parentName[0],
        totalOfPages:Math.ceil(proParent.length/9),
        currentPage:1,
        type:1,
        noti:"parent/",
    })
});
router.get('/:estateID',async function (req,res){
    const catID=req.params.estateID||0;
    const pro=await estateModel.findPage(9,0,catID)
    const proParent=await estateModel.findByEstateID(catID)
    const catIDProduct=await categoryModel.findCatByID(catID)
    const catParentProduct=await categoryModel.findCatParentByID(1)
    res.render('product/property-grid',{
        productByCatID:pro,
        catIDProduct:catIDProduct[0],
        catParentIDProduct:catParentProduct[0],
        totalOfPages:Math.ceil(proParent.length/9),
        currentPage:1,
        type:1,
        noti:"child/",
    })
});
router.get('/:estateID/:detailID',async function (req,res){
    const pro=await estateModel.findDetailProByID(req.params.detailID||0)
    const listRelatedPro=await estateModel.findProTopByEstateID(req.params.estateID||0,5)
    const listProjectPro=await  estateModel.findProByCatParentID(3)
    const listNewPro=await  estateModel.findProByCatParentID(4)
    const userOwned=await estateModel.findUserByProductOwned(req.params.detailID||0)
    listRelatedPro.forEach(i=>{
        i.parentID=1;
    })
    res.render('product/prop-single',{
        pro:pro[0],
        listRelatedPro,
        listProjectPro,
        listNewPro,
        userInfor:userOwned[0]
    })
});


router.post('/:estateID/:detailID',async function (req,res){
    const pro=await estateModel.findDetailProByID(req.params.detailID||0)
    const listRelatedPro=await estateModel.findProTopByEstateID(req.params.estateID||0,5)
    const listProjectPro=await  estateModel.findProByCatParentID(3)
    const listNewPro=await  estateModel.findProByCatParentID(4)
    const userOwned=await estateModel.findUserByProductOwned(req.params.detailID||0)
    listRelatedPro.forEach(i=>{
        i.parentID=1;
    })
    const getData=req.body
    var contact={
        proid:req.params.detailID,
        sellerid:userOwned[0].id,
        contactname:getData.name,
        contactemail:getData.email,
        contactcontent:getData.message,
        timeSend:new Date()
    }
    await estateModel.insertToConact(contact)

});

export default router;