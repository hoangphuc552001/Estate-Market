import categoryModel from "../models/category.models.js";


export default function (app){
    app.use(async function (req, res, next) {
        const cate=await categoryModel.findCategory();
        const catePa=await categoryModel.findCategoryParent();
        const category=[]
        catePa.forEach(i=>{
            let k=i
            let arrChild=[]
            cate.forEach(j=>{
                if (i.id ===+ j.parent){
                    arrChild.push(j.name)
                }
            })
            k.nameChild=arrChild
            category.push(k)
        })
        res.locals.category=category
        next();
    });
}