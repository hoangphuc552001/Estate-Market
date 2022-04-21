import express from "express";
import profileModel from "../models/profile.model..js";
import estateModel from "../models/estate.models.js";
import categoryModels from "../models/category.models.js";
import multer from "multer";



const router=express.Router();
router.get('/profile',(req,res)=>{
    res.render('user/profile',{

    })
})
var urlImage=0;

router.post("/product/url-image",(req,res)=>{
    urlImage=req.body;
    res.send(true);
});
router.post("/update-product/:id",async (req,res)=>{
    console.log(req.body);
    console.log(req.params.id);
    const update=await estateModel.updateDesByProID()
})
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
            console.error("he")
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
router.post('/product/post-product',async (req,res)=>{
    console.log(req.body);
    return res.redirect("/");
})


router.get('/product/post-product',async (req,res)=>{
    if(req.isAuthenticated()){
        const list = await estateModel.findDetailProByID(416);
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

export default router;