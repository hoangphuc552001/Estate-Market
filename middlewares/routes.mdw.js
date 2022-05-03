import muabanRoute from '../routes/muabanRoute.js'
import timkiemRoute from "../routes/timkiemRoute.js";
import estateModel from "../models/estate.models.js";
import authenRoute from "../routes/authentication.js";
import pageRoute from "../routes/pageRoute.js"
import duanRoute from "../routes/duanRoute.js";
import chothueRoute from '../routes/thueRoute.js'
import tintucRoute from "../routes/tintucRoute.js"
import userRoute from "../routes/userRoute.js";
import oauthentication from "../routes/oauthentication.js";
import api from "../routes/api.js"
import adminRoute from "../routes/adminRoute.js";
import mainRoute from "../routes/mainRoute.js";
import paypalRoute from "../routes/paypalRoute.js";
import estateModels from "../models/estate.models.js";
export default function (app) {
    const cancelProductCreate=(req, res, next)=>{
        try {
            const promise = new Promise(async (resolve, reject) => {
                const getID = await estateModels.selectProIDCancel();
                console.log(getID)
                for (const u of getID) {
                    const delDes = await estateModels.removeDetailById(u.id);
                    const desImage = await estateModels.removeImageById(u.id)
                }
                resolve(getID)
            });
            promise.then(async function (data) {
                for (const u of data) {
                    const delProduct = await estateModels.removeEstateById(u.id);
                }
                next();
            })
        }
        catch (ex){
            next();
        }

    }
    app.use('/',mainRoute)
    app.use("/nha-dat-ban",cancelProductCreate,muabanRoute)
    app.use("/tim-kiem",cancelProductCreate,timkiemRoute)
    app.use("/du-an",cancelProductCreate,duanRoute)
    app.use("/nha-dat-cho-thue",cancelProductCreate,chothueRoute)
    app.use("/tin-tuc",cancelProductCreate,tintucRoute);
    app.use("/page",pageRoute)
    app.use("/authen",cancelProductCreate,authenRoute)
    app.use("/user",userRoute)
    app.use("/auth",oauthentication)
    app.use("/api/v1",api)
    app.use("/admin",adminRoute);
    app.use("/checkout",paypalRoute);

    app.use(function (req, res,next) {
        res.render("error/404", { layout: false });
    });
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.render("error/500", { layout: false });
    });
}