import db from "../utils/db.js";
export default {
    async findByEstateID(catID) {
        const list = await db('estate').where('category', catID)
        return list
    },
    findProByCatParentID(catID){
        return db('estate').join('category','category.id','estate.category')
            .select('estate.*')
            .where('category.parent',catID)
    },
    findProTopByEstateID(catID,top){
        return db('estate').where('category',catID).limit(top).offset(0)
    },
    findProTop4Latest(){
        return db('estate').limit(4).offset(0).groupBy('id')
            .having('start','>=',
                db('estate').min('start'))
    },
    findDetailProByID(ProID){
        return db('estate') .where('estate.id',ProID)
            .join('detail_des','detail_des.pro_id','estate.id')
            .join('img_detail','img_detail.proid','estate.id')
            .join('category','category.id','estate.category')
    },
    async searchFullText(proName){
        const sql=`select * FROM estate WHERE MATCH(title) AGAINST("${proName}") or MATCH(ward) AGAINST("${proName}")`
        const raw_data= await db.raw(sql)
        return raw_data[0]
    }

}