import db from "../utils/db.js";
export default {
    //tìm danh mục theo top
    findCategoryParent(limit,offset){
        return db('categoryparent').limit(limit).offset(offset)
    },
    //tìm tất cả danh mục
    findCategory(){
        return db('category')
    },
    //tìm danh mục 1
    findCatByID(CatID){
        return db('category').where('id',CatID)
    },
    findNameParentByID(CatID){
        return db('categoryparent').select('categoryparent.name').where('categoryparent.id', CatID)
    },
    //tìm tên và id
    findCatParentByID(CatID){
        return db('categoryparent')
            .where('categoryparent.id',CatID)
    }
}