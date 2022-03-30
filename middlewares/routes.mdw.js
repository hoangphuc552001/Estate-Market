import muabanRoute from '../routes/muabanRoute.js'
import timkiemRoute from "../routes/timkiemRoute.js";
import estateModel from "../models/estate.models.js";
export default function (app) {
    app.get('/',async (req,res)=>{
        const top3EstateHouse= await estateModel.findProTopByEstateID(1,3)
        const top3EstateGround= await estateModel.findProTopByEstateID(5,3)
        const sellPro=top3EstateGround.concat(top3EstateHouse)
        const top4Latest=await estateModel.findProTop4Latest()
        const top6RentPro= await estateModel.findProTopByEstateID(6,6)
        res.render('index',{
            sellPro,
            top4Latest,
            top6RentPro
        })
    })
    app.use("/nha-dat-ban",muabanRoute)
    app.use("/tim-kiem",timkiemRoute)
    app.use(function (req, res,next) {
        res.render("404", { layout: false });
    });
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.render("500", { layout: false });
    });
}