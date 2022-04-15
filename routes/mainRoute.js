import express from "express";
import estateModel from "../models/estate.models.js";
import nodemailer from "nodemailer";
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
router.post("/mailer",async (req,res)=>{
    const contact=req.body
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
})
export default router;