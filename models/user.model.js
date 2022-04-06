import db from "../utils/db.js";
export default {
    checkEmailUser(email){
        return db("user").where("email",email)
    },
    insert(user){
        return db("user").insert(user)
    },
    findUserByEmail(email){
        return db("user").where("user.email",email)
    },
    findNameAndEmail(email){
        return db("user").select("user.email","user.name").where("user.email",email)
    }
    ,
    async comparePasswordUser(user,password){
        let isMatch=await bcrypt.compare(password,user.password)
        if (isMatch) return true
        else return "Sai mật khẩu"
    },
    findUserByID(id){
        return db("user").where("user.id",id)
    }
}