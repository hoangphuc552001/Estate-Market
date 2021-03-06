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
    findParentByCategory(cat){
        return db('category').select('category.parent').where('category.id',cat);
    },
    //Tìm tổng các danh mục bằng danh mục cha
    findTotalCategoryByParent(parent){
        return db("category").count('parent', {as: 'total'}).where('parent',parent);
    },
    //Tìm danh mục bằng tên danh mục và parent của nó
    async searchCategoryByNameAndParentID(nameCategory,parent){
        const check =await db("category").where(function (){
            this.where("category.parent",parent).andWhere('category.name',nameCategory)
        });
        return check[0];
    },
    //Thêm danh mục bằng cách nhập tên danh mục và parent
    async insertCategoryByNameAndParentID(nameCategory,parent){
        const check=await db('category').insert({
            name:nameCategory,
            parent:parent
        });
        return check;
    },
    //Tìm tất cả danh mục cha
    findAllCategoryParent(){
        return db("categoryparent").where(function (){
            this.whereNot('categoryparent.id',3).andWhereNot('categoryparent.id',4);
        })
    },
    //Xóa danh mục bằng id và parent
    async delCategoryByParentAndID(category){
        const check= await db('category').where(function (){
            this.where('id',category.id).andWhere('parent',category.parent)
        }).del();
        return check;
    },
    async delCategoryOldParent(category){
        const del =await db('category').where(function (){
            this.where('id',category.id).andWhere('parent',category.parentOld)
        }).del();
        return del;
    },
    //Cập nhật danh mục bằng id và parent
    async  updateCategoryByParentAndID(category){
        const id=category.id;
        const del =await this.delCategoryOldParent(category);
        const insert=await db('category').insert({
            id:category.id,
            name:category.name,
            parent:category.parent
        });
        return insert;
    },
}