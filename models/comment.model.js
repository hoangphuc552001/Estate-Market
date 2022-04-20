import db from "../utils/db.js";
export default {
    findAllCommentWithUser(id){
        return db("comments").join("user","user.id","comments.userid")
            .where("comments.proid",id)
    },
    insertComment(cmt){
        return db("comments").insert(cmt)
    }
}