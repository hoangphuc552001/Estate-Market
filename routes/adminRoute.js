import express from "express";
import {check, validationResult} from "express-validator"
import auth from '../validation/authValidation.js'
import registerService from "../services/registerService.js"
import passport from "passport"
import xmldom from'xmldom'
import bodyParser from "body-parser";
import multer from 'multer'
import initPassportLocal from '../middlewares/passport.mdw.js'
import estateModel from '../models/estate.models.js'
import categoryModels from "../models/category.models.js";
import userModel from "../models/user.model.js";
import * as Console from "console";
/*import {list} from "../public/assets/js/vendor.js";*/
import fs from 'fs';
import {reject} from "bcrypt/promises.js";
/*import {list} from "../public/assets/js/vendor.js";*/
const router=express.Router();


let checkIsAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.user)
        if(req.user.permissions!==1){
            return res.redirect("/");
        }
    }
    next();
};

var urlImage=0;
router.post("/url-image",(req,res)=>{

    urlImage=req.body;
})

router.post("/upload/:id", async (req,res)=>{
    let pos;
    urlImage=urlImage.url.toString();
    pos=urlImage.lastIndexOf("/");
    const url=urlImage.substring(0,pos) ;/*+ urlImage.substring(pos+1);*/
    const fileName=urlImage.substring(pos+1,urlImage.length);
    const promise=new Promise((resolve,reject)=>{
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
            console.error("he")
        } else {
            const list = await estateModel.findDetailProByID(req.params.id);
            const listward = await estateModel.findAllWard();
            listward.forEach(u => {
                if (u.ward === list[0].ward) {
                    u.check = true;
                }
            });
            resolve("hello");
          /*  res.render("admin/new-product-editor", {
                layout: 'layoutAdmin.hbs',
                list: list[0],
                listward,
            });*/
        }
    });
    });
    promise.then(async  function(data){
        return res.send({"detail": urlImage,"filename":fileName});
    });
});
router.post("/san-pham/:calling/sua-san-pham/:catID",async (req,res)=>{
    if(req.body.check){
        const update=await estateModel.updateDesByProID(req.params.catID,req.body);
        return res.send({"update":true});
      /*  return res.redirect('/san-pham/:calling/sua-san-pham/:catID');*/
    }
});
let categoryid=0;
router.get("/",checkIsAdmin,(req,res)=>{
    res.render('admin/home',{
        layout:'layoutAdmin.hbs'
        }
    )
});
router.post("/quan-li-tai-khoan/mo-khoa-tai-khoan/:ID",async (req,res)=>{
    const unlockEmail = await userModel.unblockEmailByID(req.params.ID);
    res.redirect("/admin/quan-li-tai-khoan?check=1")
});
router.post("/quan-li-tai-khoan/khoa-tai-khoan/:ID",async (req,res)=>{
    const lockEmail = await userModel.blockEmailByID(req.params.ID);
    res.redirect("/admin/quan-li-tai-khoan?check=0")
});
router.get("/quan-li-tai-khoan",checkIsAdmin ,async (req,res)=>{
    const listEmail= await userModel.findAllAccount();
    const totalEmail= await userModel.findTotalEmail().then(async (u)=>{
        return res.render('admin/account_management',{
            layout:'layoutAdmin.hbs',
            list:listEmail,
            totalEmail:u[0]
        })
    })

})
router.get("/san-pham/:calling/:catID",checkIsAdmin ,async (req,res)=>{
    if((req.params.calling!=="du-an")&&(req.params.calling!="tin-tuc")) {
        const catID = req.params.catID || 0
        const nameCategory = await categoryModels.findCatByID(catID);
        const listProduct = await estateModel.findByEstateID(catID);
        const totalProduct = await estateModel.findTotalByID(catID);

        res.render('admin/items-list', {
                layout: 'layoutAdmin.hbs',
                list: listProduct,
                nameCategory: nameCategory[0],
                totalProduct: totalProduct[0],
            }
        )
    }
    else if(req.params.catID==='them-san-pham'){
        const listward= await estateModel.findAllWard();
        res.render('admin/item-add', {
                layout: 'layoutAdmin.hbs',
                listward:listward,

            }
        )
    }
    else{
        const catID = req.params.catID || 0
        const nameCategory = await categoryModels.findCatByID(catID);
        const listProduct = await estateModel.findByEstateID(catID);
        const totalProduct = await estateModel.findTotalByID(catID);
        categoryid=req.params.catID || 0;
         for (const u of listProduct) {
            u.check = true
        }
        res.render('admin/items-list', {
                layout: 'layoutAdmin.hbs',
                list: listProduct,
                nameCategory: nameCategory[0],
                totalProduct: totalProduct[0],
                calling:req.params.calling,
                catID:catID
            }
        )
    }
})
router.get("/san-pham/:calling/sua-san-pham/:proID",checkIsAdmin ,async (req,res)=>{
    const list =await estateModel.findDetailProByID(req.params.proID);
    const listward= await estateModel.findAllWard();
    listward.forEach(u=>{
        if(u.ward===list[0].ward){
            u.check=true;
        }
    });
    res.render("admin/new-product-editor",{
        layout: 'layoutAdmin.hbs',
        list:list[0],
        listward,
    });
});







router.get("/danh-muc/:calling/:catID", checkIsAdmin ,async (req,res)=>{
    const listCategory = await categoryModels.findCategoryByParent(req.params.catID || 0);
        const totalCategory = await categoryModels.findTotalCategoryByParent(req.params.catID || 0);
        for (const u of listCategory) {
            const temp = await estateModel.findTotalByID(u.id);
            u.total = temp[0].total
        }
        res.render('admin/category-list', {
                layout: 'layoutAdmin.hbs',
                listCategory: listCategory,
                nameParent: listCategory[0].nameParent,
                parentID: listCategory[0].parent,
                totalCategory: totalCategory[0]
            }
        )
});
router.post("/danh-muc/:calling/xoa-danh-muc",async (req,res)=>{
    const delCategory= await categoryModels.delCategoryByParentAndID(req.body)
    res.send(true)
})

router.post("/danh-muc/:calling/xoa-san-pham",async (req,res)=>{

    const delProduct=await estateModel.delProductByID(req.body.proID)
    res.send(true)
})


router.post("/danh-muc/:calling/sua-danh-muc",async (req,res)=>{
    const updateCategory= await categoryModels.updateCategoryByParentAndID(req.body)
   /* res.redirect("admin")*/
    res.send("true")
})



router.get("/danh-muc/:calling/them-danh-muc/:catID", checkIsAdmin ,async (req,res)=> {
        const listCategory = await categoryModels.findCategoryByParent(req.params.catID || 0);
        res.render('admin/category-add', {
                layout: 'layoutAdmin.hbs',
                nameParent: listCategory[0].nameParent,
                catID: req.params.catID,
            }
        )
})

router.get("/danh-muc/:calling/sua-danh-muc/:parentID/:catID", checkIsAdmin ,async (req,res)=> {
        const parentID = req.params.parentID || 0;
        const catID=req.params.catID||0;
        const list = await categoryModels.findAllCategoryParent();
        const listcatID=await categoryModels.findCatByID(catID);
        list.forEach(u => {
            if (u.id === parseInt(parentID)) {
                u.check = true;
            } else {
                u.check = false;
            }
        });
        res.render('admin/category-editor', {
            layout: 'layoutAdmin.hbs',
            catID: req.params.catID,
            listCategoryParent: list,
            listcatID:listcatID[0],
            calling:req.params.calling
        })
})
router.get("/danh-muc/:calling/them-danh-muc/:catID/:catName", checkIsAdmin ,async (req,res)=>{
    const catName=req.params.catName||0;
    const check=await categoryModels.searchCategoryByNameAndParentID(catName,req.params.catID)
    res.json(!!check);
})

router.post("/danh-muc/:calling/them-danh-muc/:catID",async (req,res)=>{
   const insert=await categoryModels.insertCategoryByNameAndParentID(req.body.nameCategory,req.params.catID);
   res.redirect("/admin/danh-muc/"+req.params.calling+"/"+req.params.catID)
});

router.get("/xem-chi-tiet-san-pham/:proID",checkIsAdmin ,async (req,res)=>{
    const list=await estateModel.findDetailProByID(req.params.proID);

    res.render("admin/detail-product",{
        layout: 'layoutAdmin.hbs',
        list:list[0]
    });
})

router.post("/geturl",async (req,res) =>{
    res.render("admin/perform-image",{
        layout:false,
        name:req.body.id,
        url:req.body.url
    })
})


router.post("/san-pham/:calling/them-san-pham",async (req,res) =>{
    if((req.params.calling==="du-an")) {
        const promise = new Promise(async (resolve, reject) => {
            const insertPro = await estateModel.insertProByCategory(15, req.body);
            resolve(insertPro[0])
        });
        promise.then(async function (data) {
            const insertDetail = await estateModel.insertDetailByproID(data, req.body);
            const parentID = await categoryModels.findParentByCategory(15);
            let urlI;
            let  urlImg="/public/assets/estate/"+parentID[0].parent+"/15/";
            const total=await estateModel.findTotalByID(15);
            const myPromise=new Promise((resolve,reject)=>{
                for (let i = 1; i < total[0].total+20; i++) {
                    if (!fs.existsSync('.'+urlImg+i)) {
                        urlI=urlImg+i;
                        resolve({i:i,url:urlI,data:data});
                    }
                }
            });
            myPromise.then(async function (data) {
                console.log(data)
                fs.mkdirSync("." + data.url, {recursive: true});
                const listEstate = await estateModel.insertNewImage(data.data);
                return res.render("admin/item-add-image", {
                    layout: 'layoutAdmin.hbs',
                    category: 15,
                    parent: parentID[0].parent,
                    id: data.data,
                    url: data.i
                })
            })

        });
    }
    else{
            const promise = new Promise(async (resolve, reject) => {
                const insertPro = await estateModel.insertProByCategory(16, req.body);
                resolve(insertPro[0])
            });
            promise.then(async function (data) {
                const insertDetail = await estateModel.insertDetailByproID(data, req.body);
                const parentID = await categoryModels.findParentByCategory(16);
                console.log(parentID)
                let urlI;
                let  urlImg="/public/assets/estate/"+parentID[0].parent+"/15/";
                const total=await estateModel.findTotalByID(16);
                const myPromise=new Promise((resolve,reject)=>{
                    for (let i = 1; i < total[0].total+20; i++) {
                        if (!fs.existsSync('.'+urlImg+i)) {
                            urlI=urlImg+i;
                            resolve({i:i,url:urlI,data:data});
                        }
                        console.log('.'+urlImg+i)
                    }
                });
                myPromise.then(async function (data) {
                    fs.mkdirSync("." + data.url, {recursive: true});
                    const listEstate = await estateModel.insertNewImage(data.data);
                    return res.render("admin/item-add-image", {
                        layout: 'layoutAdmin.hbs',
                        category: 16,
                        parent: parentID[0].parent,
                        id: data.data,
                        url: data.i
                    })
                })

            });
    }
});

router.post("/add-url-image",(req,res)=>{
    urlImage="/public/assets/estate/"+req.body.parent+"/"+req.body.category+"/"+req.body.data+"/"+req.body.name;
    console.log("he"+urlImage)
    res.send(true);
});

router.post("/upload-image/:id", async (req,res)=>{
    let pos;
    console.log(req.params.id)
    urlImage=urlImage.toString();
    pos=urlImage.lastIndexOf("/");
    const url=urlImage.substring(0,pos) ;/*+ urlImage.substring(pos+1);*/
    const fileName=urlImage.substring(pos+1,urlImage.length);
    console.log("post"+urlImage)
    console.log(fileName)
    const promise=new Promise((resolve,reject)=>{
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
                console.error("he")
            } else {
                resolve({fileName:fileName});
            }
        });
    });

    promise.then(async  function(data){
        if(data.fileName.includes("1")){
            const list=await estateModel.updateNewImage(req.params.id||0,urlImage,"1");
            const listEstate=await estateModel. insertNewImageInEstate(req.params.id||0,urlImage);
            return res.send({"detail": urlImage,"position":"1"});
        }
        else if(data.fileName.includes("2")){
            const list =await estateModel.updateNewImage(req.params.id||0,urlImage,"2");
            return res.send({"detail": urlImage,"position":"2"});
        }
        else if(data.fileName.includes("3")){
            const list =await estateModel.updateNewImage(req.params.id||0,urlImage,"3");
            return res.send({"detail": urlImage,"position":"3"});
        }
    });
});

router.post("/geturl",async (req,res) =>{
    res.render("admin/perform-image2",{
        layout:false,
        name:req.body.id,
        url:req.body.url
    })
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
export default router;
