import muabanRoute from '../routes/muabanRoute.js'
import timkiemRoute from "../routes/timkiemRoute.js";
import estateModel from "../models/estate.models.js";
import loginRoute from "../routes/authen/loginRoute.js";
import signupRoute from "../routes/authen/signupRoute.js";
import pageRoute from "../routes/pageRoute.js"
import duanRoute from "../routes/duanRoute.js";
import chothueRoute from '../routes/thueRoute.js'
import tintucRoute from "../routes/tintucRoute.js"

export default function (app) {
    app.get('/', async (req,res)=>{
        const top3EstateHouse= await estateModel.findProTopByEstateID(1,3)
        const top3EstateGround= await estateModel.findProTopByEstateID(5,3)
        const sellPro=top3EstateGround.concat(top3EstateHouse)
        const top4Latest=await estateModel.findProTopLatest(4,0)
        const top6RentPro= await estateModel.findProTopByEstateID(6,6)
        const top5Project = await estateModel.findProByCatParentID(3)
        console.log(top5Project)
        res.render('product/index',{
            sellPro,
            top4Latest,
            top6RentPro,
            top5Project
        })
    })
    app.use("/nha-dat-ban",muabanRoute)
    app.use("/tim-kiem",timkiemRoute)
    app.use("/du-an",duanRoute)
    app.use("/nha-dat-cho-thue",chothueRoute)
    app.use("/tin-tuc",tintucRoute);
    app.use("/login",loginRoute)
    app.use("/register",signupRoute)
    app.use("/page",pageRoute)
    app.use(function (req, res,next) {
        res.render("error/404", { layout: false });
    });
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.render("error/500", { layout: false });
    });
}