import express from "express";
import {validationResult} from "express-validator"
import auth from '../validation/authValidation.js'
import registerService from "../services/registerService.js"
import passport from "passport"
import initPassportLocal from '../middlewares/passport.mdw.js'
import estateModel from '../models/estate.models.js'
import categoryModels from "../models/category.models.js";
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
    res.render('admin/category-list',{
            layout:'layoutAdmin.hbs',
            listCategory:listCategory,
            nameParent:listCategory[0].nameParent,
            parentID:listCategory[0].parent,
            totalCategory:totalCategory[0]
        }
    )
})

router.get("/danh-muc/them-danh-muc/:catID", async (req,res)=>{
    res.render('admin/category-editor',{
            layout:'layoutAdmin.hbs',
        }
    )
})
export default router;
