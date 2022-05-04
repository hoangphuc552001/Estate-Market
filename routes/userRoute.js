import express from "express";
import profileModel from "../models/profile.model..js";
import estateModel from "../models/estate.models.js";
import categoryModels from "../models/category.models.js";
import multer from "multer";
import fs from 'fs'
import gulp from 'gulp'
import moment from "moment";
import userModel from "../models/user.model.js";
import estateModels from "../models/estate.models.js";
import db from "../utils/db.js";
import {reject} from "bcrypt/promises.js";
import EstateModels from "../models/estate.models.js";
import ratingModel from "../models/rating.model.js";
import commentModel from "../models/comment.model.js";


const router=express.Router();
let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/authen/login");
    }
    next();
};
let checkIsLockAccount = (req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.permissions===-1){
            return res.render("user/block-account");
        }
    }
    next();
};
var urlImage=0;
router.post("/product/url",(req,res)=>{
    urlImage="/public/assets/estate/"+req.body.parent+"/"+req.body.category+"/"+req.body.data+"/"+req.body.name;
    res.send(true);
});
router.post("/product/url-image",(req,res)=>{
    urlImage=req.body;
    res.send(true);
});
router.post("/update-product/:name/:id",async (req,res)=>{
    if(req.params.name==='summary'){
        const updateSummary=await estateModel.updateSummaryByID(req.body);

    }
    else  if(req.params.name==='des'){
        const updateDes=await estateModel.updateDesByID(req.params.id,req.body.text);
    }

    else  if(req.params.name==='detaildes'){
        const updateDetailDes=await estateModel.updateDetailDesByID(req.params.id,req.body.text);
    }
    else  if(req.params.name==='otherdetail'){
        const updateOtherDetail=await estateModel.updateOtherDetailByID(req.params.id,req.body.text);
    }

    else  if(req.params.name==='price'){
        const updatePrice=await estateModel.updatePriceByID(req.params.id,req.body.text);
    }
    res.redirect('/user/product/edit-product/'+req.params.id);

});

router.post("/upload/:id",(req,res)=>{
    let pos;
    urlImage=urlImage.url.toString();
    pos=urlImage.lastIndexOf("/");
    const url=urlImage.substring(0,pos) ;/*+ urlImage.substring(pos+1);*/
    const fileName=urlImage.substring(pos+1,urlImage.length);
    const storage = multer.diskStorage({
        destination:async function (req, file, cb) {
            cb(null, '.'+url)
        },
        filename:async function (req, file, cb) {
            const uniqueSuffix = fileName;
            cb(null, uniqueSuffix)
        }
    });
    const upload=multer({storage});
    upload.single('image')(req,res,async function (err) {
        if (err) {
        } else {
            const list = await estateModel.findDetailProByID(req.params.id);
            const listward = await estateModel.findAllWard();
            listward.forEach(u => {
                if (u.ward === list[0].ward) {
                    u.check = true;
                }
            });
            return res.send({"detail": urlImage});
        }
    })
});


router.get('/product',checkIsLockAccount,async (req,res)=>{
    if(req.isAuthenticated()){
        const list=await profileModel.findProfileByID(req.user.id);
        const total=await profileModel.totalProductByID(req.user.id);
        return res.render('user/product',{
            profile:list[0],
            total,
            listProduct:list.product
        })
    }
    return res.redirect("/");
})



router.get('/product/edit-product/:proid',checkIsLockAccount,async (req,res)=>{
    if(req.isAuthenticated()){
        const list = await estateModel.findDetailProByID(req.params.proid);
        const listWard = await estateModel.findAllWard();
        listWard.forEach(u => {
            if (u.ward === list[0].ward) {
                u.check = true;
            }
        });
        const listCategory=await categoryModels.findCategoryByParent(list[0].category);
        listCategory.forEach(u => {
            if (u.name === list[0].name) {
                u.check = true;
            }
        });
        return res.render('user/form-product',{
          /*  profile:list[0],
            total,
            listProduct:list.product*/
            listWard,
            pro:list[0],
            listCategory
        })
    }
    return res.redirect("/");
})
router.get('/profile',checkLoggedIn,checkIsLockAccount,async (req,res)=>{
    if (res.locals.user){
        const user=await userModel.findUserByID(res.locals.user.id)
        const listPro=await estateModels.findProDuctOwnedByUser(res.locals.user.id)
        let pro=await estateModel.findAll(res.locals.user.id,9,0)
        res.render('user/profile',{
            userInfor:user[0],
            firstName:res.locals.user.firstName,
            listPro:pro,
            currentPage:1,
            totalOfPages:Math.ceil(listPro.length/9),
            totalPro:listPro.length,
            proList:listPro
        })
    }else{
        res.status(500).send("False")
    }
})
router.get("/profile/:id",async (req,res)=>{
    const user=await userModel.findUserByID(req.params.id)
    const listPro=await estateModels.findProDuctOwnedByUser(req.params.id)
    let pro=await estateModel.findAll(req.params.id,9,0)
    if (res.locals.user){
        var firstName=res.locals.user.firstName
        var rating=await ratingModel.findRating(parseInt(req.params.id),res.locals.user.id)
        if (rating.length>0){
            var ratingscore=rating[0].ratingscore
        }
    }
    res.render('user/profile',{
        userInfor:user[0],
        firstName,
        listPro:pro,
        currentPage:1,
        totalOfPages:Math.ceil(listPro.length/9),
        totalPro:listPro.length,
        notSeller:1,
        ratingscore
    })
})

router.get('/product/post-product',checkLoggedIn,checkIsLockAccount,async (req,res)=> {
    if (res.locals.user){
        const listParent=await categoryModels.findAllCategoryParent();
        const listWard=await estateModel.findAllWard();
        res.render("user/post-product",{
            listParent,
            listWard
        })
    }
});

router.post("/product/post-product",async (req, res) =>{
    if(req.isAuthenticated) {
        const list = req.body;
        list.seller = req.user.id;
        const index=list.price.split(",");
        if(index.length===4){
            list.current=index[0]+" tỷ"
        }
        else if(index.length===3){
            list.current=index[0]+" triệu";
        }
        else{
            list.current=index[0]+" nghìn";
        }
        list.price=list.price.replace(" VNĐ","");
        list.price=list.price.replaceAll(",","");
        list.price=parseFloat(list.price);
        const check = await estateModel.insertNewProduct(list);
        const listDes=[{
            "des":list.des,
            "detaildes":list.detaildes,
            "otherdes":list.otherdes,
            "id":check[0]
        }];
        const checkDes = await estateModel.ínsertDes(listDes);
        let urlI;
        let  urlImg="/public/assets/estate/"+list.categoryParent+"/"+list.category+"/";
        const total=await estateModel.findTotalByID(list.category);
        const myPromise=new Promise((resolve,reject)=>{
            for (let i = 1; i < total[0].total+20; i++) {
                if (!fs.existsSync('.'+urlImg+i)) {

                    urlI=urlImg+i;
                    resolve({i:i,url:urlI});
                }
                console.log('.'+urlImg+i)
            }
        });

        myPromise.then(async function (data) {
            console.log(data);
            if (!fs.existsSync("."+data.url)) {
                fs.mkdirSync("." + data.url, {recursive: true});
            }
            const listEstate = await estateModel.insertNewImage(check[0]);
            return res.render("user/post-image", {
                id: check[0],
                parent: list.categoryParent,
                category: list.category,
                url: data.i
            })
        })

    }
});

router.post("/post-product/upload/:id",(req,res)=>{
    let pos;
    urlImage=urlImage.toString();
    pos=urlImage.lastIndexOf("/");
    const url=urlImage.substring(0,pos) ;/*+ urlImage.substring(pos+1);*/
    const fileName=urlImage.substring(pos+1,urlImage.length);
    const storage = multer.diskStorage({
        destination:async function (req, file, cb) {
            cb(null, '.'+url)
        },
        filename:async function (req, file, cb) {
            const uniqueSuffix = fileName;
            cb(null, uniqueSuffix)
        }
    });
    const upload=multer({storage});
    upload.single('image')(req,res,async function (err) {
        if (err) {
        } else {
            console.log(req.params.id)
            console.log(fileName)
            if(fileName.includes("1")){
                const list=await estateModel.updateNewImage(req.params.id||0,urlImage,"1");
                const listEstate=await estateModel. insertNewImageInEstate(req.params.id||0,urlImage);
                return res.send({"detail": urlImage,"position":"1"});
            }
            else if(fileName.includes("2")){
                const list =await estateModel.updateNewImage(req.params.id||0,urlImage,"2");
                return res.send({"detail": urlImage,"position":"2"});
            }
            else if(fileName.includes("3")){
                const list =await estateModel.updateNewImage(req.params.id||0,urlImage,"3");
                return res.send({"detail": urlImage,"position":"3"});
            }
        }
    })
});

router.get("/select-category-parent/:parent",checkIsLockAccount,async (req,res) =>{
    const listCate=await categoryModels.findCategoryByParent(req.params.parent);
    res.json(listCate);
})


router.post("/geturl",async (req,res) =>{
    res.render("user/perform-image",{
        layout:false,
        name:req.body.id,
        url:req.body.url
    })
})
router.get("/checkprice/:price",checkIsLockAccount,async (req,res) =>{
    const temp=req.params.price;
    if(temp.includes("tỷ")||temp.includes("tỉ")||temp.includes("triệu")){
        return res.json(true);
    }
    return res.json(false);
});
router.get("/check-title/:title",checkIsLockAccount,async (req,res) =>{
    console.log(req.params.title.length)
    if(req.params.title===""){
        return res.json("fals3232e");
    }
    return res.json("tr323ue");
});

router.post("/product/remove-product",async (req,res)=>{
    console.log(req.body);
    const myPromise=new Promise(async (resolve, reject) => {
        const delImg = await estateModel.removeImageById(req.body.proid)
        const delDetail = await estateModel.removeDetailById(req.body.proid);
        let pos;
        const urlImage = await estateModel.findImageById(req.body.proid);
        let urlImageTemp=urlImage[0].image;
        urlImageTemp= urlImageTemp.toString();
        pos=urlImageTemp.lastIndexOf("/");
        const url=urlImageTemp.substring(0,pos);/*+ urlImage.substring(pos+1);*/
        resolve(url);
    });
    myPromise.then(async function (data) {
        console.log("."+data);
        if (fs.existsSync("."+data)) {
            fs.rmdirSync("."+data,{ recursive: true });
            console.log("done");
        }
        const delEstate = await estateModel.removeEstateById(req.body.proid);
        return res.send(true);
    })
})
router.post("/updateprofile",async (req,res)=>{
    const object=req.body
    const dob = moment(object.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD')
    object.birthday=dob
    await userModel.updateUser(object)
    req.user.name=object.name
    req.user.address=object.address
    req.user.phone=object.phone
    req.user.birthday=object.birthday
    res.locals.user=req.user
    var user_ = res.locals.user
    user_ = user_.name
    user_ = user_.split(" ")
    user_ = user_[0]
    res.locals.user.firstName = user_
    if (res.locals.user){
        const user=req.user
        const listPro=await estateModels.findProDuctOwnedByUser(req.user.id)
        let pro=await estateModel.findProDuctOwnedByUserByTop(req.user.id,9,0)
        res.render('user/profile',{
            userInfor:user,
            firstName:res.locals.user.firstName,
            listPro:pro,
            currentPage:1,
            totalOfPages:Math.ceil(listPro.length/9),
            totalPro:listPro.length,
            updateSuccess:"Cập nhật thành công"
        })
    }else{
        res.status(500).send("False")
    }

})
router.post("/post-product/avatar/:userId",(req,res,next)=>{
    const userId=req.params.userId
    const folderName = "./public/assets/user/"+userId
    const folderAdd = "/public/assets/user/" +userId+ "/";
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
    } catch (err) {
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, folderName);
        },
        filename: function (req, file, cb) {
            cb(null, "avatar.jpg");
        },
    });
    const upload = multer({storage});
    upload.single('avatar')(req,res,async function (err){
        if (err) {
            console.error(err);
        } else {
            await userModel.add_image(folderName.replace(".","") + "/avatar.jpg",userId)
            return res.redirect("/user/profile");
        }
    })
})
export default router;