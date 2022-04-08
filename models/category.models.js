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
    //tìm tên và id
    findCatParentByID(CatID){
        return db('categoryparent')
            .where('categoryparent.id',CatID)
    },
    //tìm tất cả danh mục bằng id danh mục cha
    findCategoryByParent(parent){
        return db('category').select('category.*','categoryparent.name as nameParent' ).join('categoryparent','category.parent','categoryparent.id')
            .where('category.parent',parent)
    },
    findTotalCategoryByParent(parent){
        return db("category").count('parent', {as: 'total'}).where('parent',parent);
    }
}