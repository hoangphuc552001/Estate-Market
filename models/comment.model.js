import db from "../utils/db.js";
export default {
    findAllCommentWithUser(){
        return db("comments").join("user","user.id","comments.userid")
    },
    insertComment(cmt){
        return db("comments").insert(cmt)
    }
}