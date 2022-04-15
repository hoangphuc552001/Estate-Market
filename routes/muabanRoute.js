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
    const output=`
    <p>You have a new contact request </p>
    <h3>Contact Details</h3>
    <ul>
        <li>Email: ${contact.contactemail}</li>
        <li>Name: ${contact.contactname}</li>
    </ul>
    <h3>Message</h3>
    <p>${contact.contactcontent}</p>
    `
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hagl.realestatemarket@gmail.com',
            pass: 'hoanganhgialai'
        }
    });

    var mailOptions = {
        from: 'hagl.realestatemarket@gmail.com',
        to: 'hoangphuc552001@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        html:output
    };


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.render('product/prop-single',{
        pro:pro[0],
        listRelatedPro,
        listProjectPro,
        listNewPro,
        userInfor:userOwned[0]})
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message sent: %s', info.messageId);
    //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    //
    //     res.render('product/prop-single',{
    //         pro:pro[0],
    //         listRelatedPro,
    //         listProjectPro,
    //         listNewPro,
    //         userInfor:userOwned[0]
    //     })
    // });
});

export default router;