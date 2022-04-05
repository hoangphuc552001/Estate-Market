import categoryModel from "../models/category.models.js";


export default function (app){
    app.use(async function (req, res, next) {
        const cate=await categoryModel.findCategory();
        const catePa1=await categoryModel.findCategoryParent(2,0);
        const catePa2=await categoryModel.findCategoryParent(1,3);
        const category=[]
        catePa1.forEach(i=>{
            let k=i
            let arrChild=[]
            cate.forEach(j=>{
                if (i.id ===+ j.parent){
                    const catChild={name:j.name,catID:j.id,parentID:j.parent}
                    arrChild.push(catChild)
                }
            })
            k.nameChild=arrChild
            category.push(k)
        })
        res.locals.category=category
        res.locals.catSeemore=catePa2
        next();
    });
    app.use(async function(req,res,next){
        res.locals.session=req.session
        res.locals.authenticated = req.isAuthenticated();
        if (res.locals.authenticated == true){
            res.locals.user = req.user;
            var user_ = res.locals.user
            user_ = user_.name
            user_ = user_.split(" ")
            user_ = user_[0]
            res.locals.user.firstName = user_
        }
        else res.locals.user=null
        next();
    })
}