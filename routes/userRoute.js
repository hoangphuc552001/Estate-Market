import express from "express";
import profileModel from "../models/profile.model..js";
import estateModel from "../models/estate.models.js";
import categoryModels from "../models/category.models.js";
import multer from "multer";
import fs from 'fs'

import userModel from "../models/user.model.js";
import estateModels from "../models/estate.models.js";
import db from "../utils/db.js";

const router=express.Router();
let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/authen/login");
    }
    next();
};

var urlImage=0;

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
const upload = multer({});
router.post("/post-product/upload/:id",upload.single('image'),async (req,res)=>{
    /*let pos;
    urlImage=urlImage.url.toString();
    pos=urlImage.lastIndexOf("/");
    const url=urlImage.substring(0,pos) ;/!*+ urlImage.substring(pos+1);*!/
    const fileName=urlImage.substring(pos+1,urlImage.length);*/
    const temp=req.body.initialPreviewConfig;
    const temp2=JSON.parse(temp);
    console.log(temp2);
    /*console.log(req.body.initialPreviewConfig);
    console.log(req.params.id)*/
    const storage = multer.diskStorage({
        destination:async function (req, file, cb) {
            cb(null, '.'+url)
        },
        filename:async function (req, file, cb) {
           /* const uniqueSuffix = fileName;*/
            cb(null, uniqueSuffix)
        }
    });
    /*const upload=multer({storage});
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
    })*/
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


router.get('/product',async (req,res)=>{
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



router.get('/product/edit-product/:proid',async (req,res)=>{
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
router.get('/profile',checkLoggedIn,async (req,res)=>{
    if (res.locals.user){
        const user=await userModel.findUserByID(res.locals.user.id)
        const listPro=await estateModels.findProDuctOwnedByUser(res.locals.user.id)
        let pro=await estateModel.findProDuctOwnedByUserByTop(res.locals.user.id,9,0)
        res.render('user/profile',{
            userInfor:user[0],
            firstName:res.locals.user.firstName,
            listPro:pro,
            currentPage:1,
            totalOfPages:Math.ceil(listPro.length/9),
            totalPro:listPro.length
        })
    }else{
        res.status(500).send("False")
    }
})


router.get('/product/post-product',checkLoggedIn,async (req,res)=> {
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
        console.log(list.price)
        const index=list.price.split(",");
        if(index.length===4){
            list.current=index[0]+" tỷ"
        }
        if(index.length===3){
            list.current=index[0]+" triệu";
        }
        list.price=list.price.replace(" VNĐ","");
        list.price=list.price.replaceAll(",","");
        list.price=parseFloat(list.price);
        console.log(list);
        const check = await estateModel.insertNewProduct(list);
        res.redirect("/user/product/post-image/"+list.categoryParent+"/"+list.category);
    }
});
router.get("/select-category-parent/:parent",async (req,res) =>{

    const listCate=await categoryModels.findCategoryByParent(req.params.parent);
    res.json(listCate);
});
router.get('/product/post-image/:parent/:cate',async (req,res)=>{
    const total=await estateModel.findTotalByID(req.params.cate);
    console.log(total);
    console.log('./public/assets/estate/'+req.params.parent+"/"+req.params.cate+"/"+parseInt(total[0].total+1));
    fs.readdir('./public/assets/estate/'+req.params.parent+"/"+req.params.cate+"/"+parseInt(total[0].total+1),"utf-8",(err,data)=>{
        console.log(data);
        if(err){
            console.log('./public/assets/estate/'+req.params.parent+"/"+req.params.cate+"/"+parseInt(total[0].total+1));
        }
        else
        {
            console.log(data);
        }
    });

    return res.render('user/post-image',{
    })
})

router.get("/checkprice/:price",async (req,res) =>{
    console.log(req.params.price);
    const temp=req.params.price;
    if(temp.includes("tỷ")||temp.includes("tỉ")||temp.includes("triệu")){
        return res.json(true);
    }
    return res.json(false);
});
export default router;