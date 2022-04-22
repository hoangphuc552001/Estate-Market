import db from "../utils/db.js";
export default {
    insert(userrate,ratingscore,idinsert,type){
        return db.raw(`call insertTableRating(${userrate},${ratingscore},${idinsert},${type})`)
    },
    findRatingUser(userid,proid){
        return db('rating').where('rating.userrate',userid)
            .andWhere('rating.id',proid)
    }
}