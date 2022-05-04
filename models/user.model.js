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
    },
    async findAllAccount(){
        const list=await db('user').select('user.*');
      return list
    },
    findTotalEmail(){
        return db("user").count('user.email', {as: 'total'});
    },
    async comparePasswordUser(user,password){
        let isMatch=await bcrypt.compare(password,user.password)
        if (isMatch) return true
        else return "Sai mật khẩu"
    },
    findUserByID(id){
        return db("user").where("user.id",id)
    },
    async blockEmailByID(id){
        const check=await db("user").where('id',id).update({
            'permissions':-1,
        });
        console.log(check);
        return check;
    },

    async unblockEmailByID(id){
        const check=await db("user").where('id',id).update({
            'permissions':0,
        });
        return check;
    },
    updateUser(object){
        return db("user").where("user.email",object.email)
            .update({
                name:object.name,
                phone:object.phone,
                address:object.address,
                birthday:object.birthday,
            })
    },
    updateRatingscore(score,email){
        return db("user").update({ratingscore:score})
            .where("user.email",email)
    },
    add_image(img,userId){
        return db("user").update({avatar:img}).where("user.id",userId)
    }


}