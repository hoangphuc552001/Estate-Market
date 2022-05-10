import bcryptjs from "bcryptjs"
import userModelPro from "../models/user.model.js";
export default {
    createNewUser(user){
        return new Promise(async (resolve,reject)=>{
            try{
                let check= await userModelPro.checkEmailUser(user.email)
                if (check.length>0){
                    reject(`Email "${user.email} đã tồn tại. vui lòng chọn email khác`)
                }
                else {

                    let salt=bcryptjs.genSaltSync(10)

                    let data={
                        name:user.name,
                        email:user.email,
                        password:bcryptjs.hashSync(user.password.trim(),salt),
                        permissions:user.permissions,
                        birthday:user.birthday,
                        address:user.address,
                        phone:user.phone,
                        avatar:user.avatar
                    }
                    try{
                        await userModelPro.insert(data)
                        resolve("Đăng ký thành công")
                    }catch (error){
                        reject(error)
                    }
                }

            }catch (e){
                reject(e)
            }
        })
    }


}
