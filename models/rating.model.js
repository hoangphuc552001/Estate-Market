import db from "../utils/db.js";
export default {
    insert(userrate,ratingscore,idinsert,type,comment){
        if (type==0) return db.raw(`call insertTableRating(${idinsert},${ratingscore},${userrate},${type})`)
        else return db.raw(`call insertTableUserRating(${idinsert},${ratingscore},${userrate},${type},'${comment}')`)
    },
    findRating(userid,proid) {
        return db('rating').where('rating.userrate', userid)
            .andWhere('rating.idrating', proid)
    },
    findRatingFromUser(userid){
        return db('rating').where('rating.userrate',userid)
    }
}