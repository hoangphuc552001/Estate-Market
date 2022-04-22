import express from "express";
import estateModel from "../models/estate.models.js";
import nodemailer from "nodemailer";
import userModel from "../models/user.model.js";
import commentModel from "../models/comment.model.js";
import ratingModel from "../models/rating.model.js";
const router=express.Router();

router.get('/',async function (req,res){
    const top3EstateHouse= await estateModel.findProTopByEstateID(1,3)
    const top3EstateGround= await estateModel.findProTopByEstateID(5,3)
    const sellPro=top3EstateGround.concat(top3EstateHouse)
    const top4Latest=await estateModel.findProTopLatest(4,0)
    const top6RentPro= await estateModel.findProTopByEstateID(6,6)
    const top5Project = await estateModel.findProByCatParentID(3)
    const top5News=await estateModel.findProByCatParentID(4)
    res.render('product/index',{
        sellPro,
        top4Latest,
        top6RentPro,
        top5Project,
        top5News
    })
});
router.post("/comment",async (req,res)=>{
    const user=await userModel.findUserByEmail(req.body.email)
    const id=user[0].id
    const object={userid:id,content:req.body.message,timecmt:new Date(),proid:req.body.id}
    await commentModel.insertComment(object)
    const comment=await commentModel.findAllCommentWithUser(req.body.id)
    res.render("product/commentLayout",{
        comment,
        layout:false
    })
})
router.post("/rating",async (req,res)=>{
    const userid=await userModel.findUserByEmail(req.body.email)
    //type=0:product,type=1:user
    const object={
        ratingscore:parseInt(req.body.value),
        userrate:userid[0].id,
        type:0
    }
    const object1={
        estateid:parseInt(req.body.id)
    }
    await ratingModel.insert(object.userrate,object.ratingscore,object1.estateid,object.type)
    res.status(200).send(object.ratingscore.toString())
})
router.post("/mailer",async (req,res)=>{
    try{
        const contact=req.body
        const idSeller=await userModel.findUserByEmail(contact.seller.toString().trim())
        const data={
            proid: contact.id,
            sellerid: idSeller[0].id,
            contactname:contact.name,
            contactemail:contact.email,
            contactcontent:contact.message,
            timeSend:new Date()
        }
        await estateModel.insertToConact(data)
        const output=`
    <h1><i>You have a new contact request</i></h1>
    <h3>Property Details</h3>
    <h5>${contact.title}</h5>
    <table style="border: 1px solid black">
        <tbody>
        <tr>
            <th style="border: 1px solid black">ID</th>
            <td style="border: 1px solid black">${contact.id}</td>
        </tr>
         <tr>
            <th style="border: 1px solid black">Type</th>
            <td style="border: 1px solid black">${contact.type}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black">Status</th>
            <td style="border: 1px solid black">${contact.state}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black">Acreage</th>
            <td style="border: 1px solid black">${contact.acreage.substr(0,contact.acreage.search("m"))}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black">Ward</th>
            <td style="border: 1px solid black">${contact.ward}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black">Bedroom</th>
            <td style="border: 1px solid black">${contact.bed}</td>
        </tr>
        <tr>
            <th style="border: 1px solid black">Bathroom</th>
            <td style="border: 1px solid black">${contact.bath}</td>
        </tr>
        </tbody>
    </table>
    <h3>Contact Details</h3>
    <ul>
        <li>Email: ${contact.name}</li>
        <li>Name: ${contact.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${contact.message}</p>
    <hr>
    <h3 style="color: green">HAGL</h3>
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
            to: contact.email,
            subject: 'HAGL Notification',
            text: 'Notification from HAGL',
            html:output
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.status(200).send("OK")
    }catch (e) {
        res.status(500).send("Error")
    }

})
export default router;