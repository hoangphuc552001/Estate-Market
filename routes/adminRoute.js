import express from "express";
import {validationResult} from "express-validator"
import auth from '../validation/authValidation.js'
import registerService from "../services/registerService.js"
import passport from "passport"
import initPassportLocal from '../middlewares/passport.mdw.js'
import estateModel from '../models/estate.models.js'
import categoryModels from "../models/category.models.js";
/*import {list} from "../public/assets/js/vendor.js";*/
const router=express.Router();

router.get("/",(req,res)=>{
    res.render('admin/home',{
        layout:'layoutAdmin.hbs'
        }
    )
})
router.get("/san-pham/:calling/:catID",async (req,res)=>{
    const catID=req.params.catID||0
    const nameCategory=await  categoryModels.findCatByID(catID);
    const listProduct = await estateModel.findByEstateID(catID);
    const totalProduct=await estateModel.findTotalByID(catID);
    res.render('admin/items-list',{
            layout:'layoutAdmin.hbs',
            list:listProduct,
            nameCategory:nameCategory[0],
            totalProduct:totalProduct[0]
        }
    )
})
router.get("/danh-muc/:calling/:catID", async (req,res)=>{
    const listCategory=await categoryModels.findCategoryByParent(req.params.catID||0);
    const totalCategory =await  categoryModels.findTotalCategoryByParent(req.params.catID||0);
    for (const u of listCategory) {
        const temp= await estateModel.findTotalByID(u.id);
        u.total=temp[0].total
    }
    res.render('admin/category-list',{
            layout:'layoutAdmin.hbs',
            listCategory:listCategory,
            nameParent:listCategory[0].nameParent,
            parentID:listCategory[0].parent,
            totalCategory:totalCategory[0]
        }
    )
});
router.post("/danh-muc/:calling/xoa-danh-muc",async (req,res)=>{
    const delCategory= await categoryModels.delCategoryByParentAndID(req.body)
    res.send(true)
})


router.get("/danh-muc/:calling/them-danh-muc/:catID", async (req,res)=> {
        const listCategory = await categoryModels.findCategoryByParent(req.params.catID || 0);
        res.render('admin/category-add', {
                layout: 'layoutAdmin.hbs',
                nameParent: listCategory[0].nameParent,
                catID: req.params.catID,
            }
        )
})

router.get("/danh-muc/:calling/sua-danh-muc/:parentID/:catID", async (req,res)=> {
        const parentID = req.params.parentID || 0;
        const catID=req.params.catID||0;
        const list = await categoryModels.findAllCategoryParent();
        const listcatID=await categoryModels.findCatByID(catID);
        console.log(listcatID[0])

        list.forEach(u => {
            if (u.id === parseInt(parentID)) {
                u.check = true;
            } else {
                u.check = false;
            }
        });
        res.render('admin/category-editor', {
            layout: 'layoutAdmin.hbs',
            catID: req.params.parentID,
            listCategoryParent: list,
            listcatID:listcatID[0]
        })
})
router.post("/danh-muc/:calling/sua-danh-muc/:parentID/:catID", async (req,res)=> {
    console.log(req.body.categoryParent);
    console.log(req.body.nameCategory)
})
router.get("/danh-muc/:calling/them-danh-muc/:catID/:catName", async (req,res)=>{
    const catName=req.params.catName||0;
    const check=await categoryModels.searchCategoryByNameAndParentID(catName,req.params.catID)
    res.json(!!check);
})

router.post("/danh-muc/:calling/them-danh-muc/:catID",async (req,res)=>{
   console.log(req.body.nameCategory);
   console.log(req.params.catID);
   const insert=await categoryModels.insertCategoryByNameAndParentID(req.body.nameCategory,req.params.catID);
   res.redirect("/admin/danh-muc/"+req.params.calling+"/"+req.params.catID)
});

export default router;
