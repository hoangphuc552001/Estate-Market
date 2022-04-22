import db from "../utils/db.js";
export default {
    async findProfileByID(id) {
        const list = await db("user").where("user.id",id);
        const listProduct= await db("category").join("estate","estate.category","category.id").join("categoryparent","categoryparent.id","category.parent").select("estate.*","estate.id as proid" ,"categoryparent.*","category.*").where("estate.seller",id);
        list.product=listProduct;
        return list;
    },
    async totalProductByID(id) {
        const listProduct = await db("estate").count('estate.seller', {as: 'total'}).where('estate.seller', id);

        return listProduct[0];
    },
}