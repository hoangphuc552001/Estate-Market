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
    async findDetailProByID(ProID){
        const data= await db('estate') .where('estate.id',ProID)
            .join('detail_des','detail_des.pro_id','estate.id')
            .join('img_detail','img_detail.proid','estate.id')
            .join('category','category.id','estate.category')
        return data;
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
    },
    //tìm tổng sản phẩm bằng category id
    findTotalByID(CatID){
        return db("estate").count('category', {as: 'total'}).where('category',CatID);
    },
    findAllWard(){
        return db('estate').select('estate.ward').groupBy('estate.ward')
    },
    findImageDetailByProID(proID){
        return db('img_detail').where('proID',proID)
    },
    async updateDesByProID(proID,product){
        const checkDes=await db('detail_des').where('pro_id',proID).update('des',product.des)
        const check=db('estate').where('id',proID).update({
            'title':product.title,
            'ward':product.ward
        })
        return checkDes,check;
    },
    async delProductByID(id){
        const check= await db('estate').where('estate.id',id).del();
        return check;
    },
    findProDuctOwnedByUser(userid){
        return db("estate").where("seller",userid)
    },
    findProDuctOwnedByUserByTop(userid,limit_,offset_){
        return db("estate").where("seller",userid).limit(limit_).offset(offset_)
    },
    async updateSummaryByID(entity){
        console.log(entity)
        const checkDes=await db('estate').where('estate.id',entity.proID).update({
            'ward': entity.ward,
            'bathroom':entity.bathroom,
            'bedroom':entity.bedroom,
            'quantity':entity.quantity,
            'acreage':entity.acreage,
            'category':entity.category,
        });
        return checkDes;
    },
    async updateDesByID(id,text){
        const checkDes=await db('detail_des').where('pro_id',id).update({
            'des':text
        });
        return checkDes;
    },

    async updateDetailDesByID(id,text){
        const checkDes=await db('detail_des').where('pro_id',id).update({
            'detail_description':text
        });
        return checkDes;
    },
    async updateOtherDetailByID(id,text){
        const checkDes=await db('detail_des').where('pro_id',id).update({
            'other_detail':text
        });
        return checkDes;
    },

    async updatePriceByID(id,text){
        const checkDes=await db('estate').where('estate.id',id).update({
            'current':text
        });
        return checkDes;
    },
    async insertNewProduct(entity) {

        const check=await db("estate").insert({
            title:entity.title,
            current:entity.current,
            quantity:entity.quantity,
            ward:entity.ward,
            category:entity.category,
            acreage:entity.acreage,
            bedroom:entity.bedroom,
            bathroom:entity.bathroom,
            seller: entity.seller,
            price:entity.price,
            image:"1"
        }).select('estate.id');
        return check;
    },

    async ínsertDes(entity) {
        entity=entity[0];
        const check2 = await db("detail_des").insert({
            des: entity.des,
            detail_description: entity.detaildes,
            other_detail: entity.otherdes,
            pro_id:entity.id
        });
        return check2;
    },
    async insertNewImageInEstate(id,url){
        const check=await db("estate").where("estate.id",id).update(
            {
            image:url
        })
        return check
    },
    async insertNewImage(id){
        const check2=await db("img_detail").insert({
            proid:id,
        });
        return check2
    },
    async insertProByCategory(id,entity){
        const check2=await db("estate").insert({
            title:entity.title,
            acreage:"null",
            seller:1,
            start:new Date(),
            category:id,
            image:"1",
            quantity:1,
            price:0,
            ward:entity.ward,
            current:"null"
        }).select("estate.id");
        return check2;
    },
    async insertDetailByproID(id,entity){
        const check2=await db("detail_des").insert({
           pro_id:id,
            des:entity.des,
            detail_description:entity.des,
            other_detail:entity.des
        });
        return check2;
    },

    async insertImageByproID(id){
        const check2=await db("img_detail").insert({
            proid:id,
        });
        return check2;
    },

      async updateNewImage(id, url, index) {
           if(index.includes("1")){
               console.log(index)
               const check=await db("img_detail").where('img_detail.proid',id).update({
                   proid:id,
                   image1:url
               });
               return check
           }
           else  if(index.includes("2")){
               console.log(index)
               const check=await db("img_detail").where('img_detail.proid',id).update({
                   proid:id,
                   image2:url
               });
               return check
           }
           else   if(index.includes("3")){
               console.log(index)
               const check=await db("img_detail").where('img_detail.proid',id).update({
                   proid:id,
                   image3:url
               });
               return check
           }
      },
    async removeDetailById(proid){
        const check=db('detail_des').where('detail_des.pro_id',proid).del();
        return check;
    },
    async removeEstateById(proid){
        const check=db('estate').where('estate.id',proid).del();
        return check;
    },

    async removeImageById(proid){
        const check=db('img_detail').where('img_detail.proid',proid).del();
        return check;
    },

    async findImageById(proid){
        const check=db('estate').select('estate.image').where('estate.id',proid)
        return check;
    },



}