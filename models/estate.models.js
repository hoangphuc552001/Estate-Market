import db from "../utils/db.js";
export default {
    //Tìm bđs sản bằng danh mục 1
    async findByEstateID(catID) {
        const list = await db('estate').where('category', catID)
        return list
    },
    //Tìm bđs sản bằng danh mục 2
    findProByCatParentID(catID,limit_,offset_){
        return db('estate').join('category','category.id','estate.category')
            .join('categoryparent','categoryparent.id','category.parent')
            .select('estate.*','categoryparent.calling')
            .where('category.parent',catID)
            .limit(limit_).offset(offset_)
    },
    //Tìm bđs top
    findProTopByEstateID(catID,top){
        return db('estate').select('estate.*','categoryparent.calling').where('category',catID)
            .join("category","category.id","estate.category")
            .join("categoryparent","categoryparent.id","category.parent")
            .limit(top).offset(0)
    },
    //tìm bđs top và sớm
    findProTopLatest(limit,offset){
        return db('estate').limit(limit).offset(offset).groupBy('id')
            .having('start','>=',
                db('estate').min('start'))
    },
    //tìm thông tin chi tiết bđs
    findDetailProByID(ProID){
        return db('estate') .where('estate.id',ProID)
            .join('detail_des','detail_des.pro_id','estate.id')
            .join('img_detail','img_detail.proid','estate.id')
            .join('category','category.id','estate.category')
    },
    //tìm full text
    async searchFullText(proName,ward_,type,bedroom,bathroom,minprice,maxprice,limit_,offset_){
        if (proName == ''){
            if (ward_ == "Tất cả") ward_="%%"
            if (type == "Tất cả") type="%%"
            if (bedroom == "Nhiều") bedroom="%%"
            if (bathroom == "Nhiều") bathroom="%%"
            const sql=`select e.*,p.calling FROM estate as e 
                join category as c on e.category = c.id
                join categoryparent as p on c.parent=p.id
                       WHERE e.ward like "${ward_}" and 
                           e.bedroom like "${bedroom}" and e.bathroom like "${bathroom}" 
                       and e.price between ${minprice} and ${maxprice} and p.id like "${type}"
                           limit ${limit_} OFFSET ${offset_}
                       `
            const raw_data= await db.raw(sql)
            return raw_data[0]
        }
        else{
            if (ward_ == "Tất cả") ward_="%%"
            if (type == "Tất cả") type="%%"
            if (bedroom == "Nhiều") bedroom="%%"
            if (bathroom == "Nhiều") bathroom="%%"
            const sql=`select e.*,p.calling FROM estate as e
                join category as c on e.category = c.id
                join categoryparent as p on c.parent=p.id
                       WHERE (MATCH(title) AGAINST("${proName}") or MATCH(ward) AGAINST("${proName}")) and 
                             e.ward like "${ward_}" and 
                           e.bedroom like "${bedroom}" and e.bathroom like "${bathroom}" 
                       and e.price between ${minprice} and ${maxprice} and p.id like "${type}"
                           limit ${9} OFFSET ${offset_}`
            const raw_data= await db.raw(sql)
            return raw_data[0]
        }
    },
    async searchFullTextTotal(proName,ward_,type,bedroom,bathroom,minprice,maxprice){
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
                       and e.price between ${minprice} and ${maxprice} and p.id like "${type}"
                           
                       `
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
                       and e.price between ${minprice} and ${maxprice} and p.id like "${type}"
                          `
            const raw_data= await db.raw(sql)
            return raw_data[0]
        }
    },
    //tìm theo top(trang) theo danh mục 1
    findPageParent(limit,offset,catParent){
        return db("estate").select("estate.*","categoryparent.calling").join("category","category.id","estate.category")
            .join("categoryparent","categoryparent.id","category.parent")
            .where("category.parent",catParent)
            .limit(limit)
            .offset(offset)
    },
    //tìm theo top(trang) theo danh mục 2
    findPage(limit,offset,catID){
        return db("estate").select("estate.*","categoryparent.calling").join("category","category.id","estate.category")
            .join("categoryparent","categoryparent.id","category.parent")
            .where("estate.category",catID)
            .limit(limit)
            .offset(offset)
    },
    findUserByProductOwned(proID){
        return db("user").select("user.*").join("estate","user.id","estate.seller")
            .where("estate.id",proID)
    },
    insertToConact(contact){
        return db("contact").insert(contact)
    }
}