import db from "../utils/db.js";
export default {
    findCategoryParent(){
        return db('categoryparent')
    },
    findCategory(){
        return db('category')
    }
}