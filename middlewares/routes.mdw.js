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
export default function (app) {
    app.use('/',mainRoute)
    app.use("/nha-dat-ban",muabanRoute)
    app.use("/tim-kiem",timkiemRoute)
    app.use("/du-an",duanRoute)
    app.use("/nha-dat-cho-thue",chothueRoute)
    app.use("/tin-tuc",tintucRoute);
    app.use("/page",pageRoute)
    app.use("/authen",authenRoute)
    app.use("/user",userRoute)
    app.use("/auth",oauthentication)
    app.use("/api/v1",api)
    app.use("/admin",adminRoute)
    app.use(function (req, res,next) {
        res.render("error/404", { layout: false });
    });
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.render("error/500", { layout: false });
    });
}