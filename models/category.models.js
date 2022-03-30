import db from "../utils/db.js";
export default {
    findCategoryParent(limit,offset){
        return db('categoryparent').limit(limit).offset(offset)
    },
    findCategory(){
        return db('category')
    },
    findCatByID(CatID){
        return db('category').where('id',CatID)
    },
    findCatParentByID(CatID){
        return db('categoryparent').select('categoryparent.name').join('category','categoryparent.id','category.parent')
            .where('category.id',CatID)
    }
}