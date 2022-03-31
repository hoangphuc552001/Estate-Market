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
    async searchFullText(proName,ward_,type,bedroom,bathroom,minprice,maxprice){
        if (proName == ''){
            if (ward_ == "Tất cả") ward_="%%"
            if (type == "Tất cả") type="%%"
            if (bedroom == "Nhiều") bedroom="%%"
            if (bathroom == "Nhiều") bathroom="%%"
            const sql=`select * FROM estate as e
                join category as c on e.category = c.id
                join categoryparent as p on c.parent=p.id
                       WHERE e.ward like "${ward_}" and 
                           e.bedroom like "${bedroom}" and e.bathroom like "${bathroom}" 
                       and e.price between ${minprice} and ${maxprice} and p.id like "${type}"`
            const raw_data= await db.raw(sql)
            return raw_data[0]
        }
        else{
            if (ward_ == "Tất cả") ward_="%%"
            if (type == "Tất cả") type="%%"
            if (bedroom == "Nhiều") bedroom="%%"
            if (bathroom == "Nhiều") bathroom="%%"
            const sql=`select * FROM estate as e
                join category as c on e.category = c.id
                join categoryparent as p on c.parent=p.id
                       WHERE (MATCH(title) AGAINST("${proName}") or MATCH(ward) AGAINST("${proName}")) and 
                             e.ward like "${ward_}" and 
                           e.bedroom like "${bedroom}" and e.bathroom like "${bathroom}" 
                       and e.price between ${minprice} and ${maxprice} and p.id like "${type}"`
            const raw_data= await db.raw(sql)
            return raw_data[0]
        }

    }
}