import userModelPro from "../models/user.model.js";
import bcryptjs from "bcryptjs";
export default {
    findUserByEmail(email){
        return new Promise(async  (resolve,reject)=>{
            try{
                let user= await userModelPro.findUserByEmail(email)
                if (user.length<=0) {
                    resolve(null)
                }
                else {
                    user=user[0]
                    resolve(user)
                }
            }catch (e){
                reject(e)
            }
        })
    },
    comparePasswordUser(user, password) {
        return new Promise(async (resolve,reject)=>{
            try{
                await bcryptjs.compare(password, user.password).then((isMatch) => {
                    if (isMatch) {
                        resolve(true);
                    } else {
                        resolve(`Sai mật khẩu`);
                    }
                });
            }catch (e){
                reject(e)
            }
        });
    },
    findUserByID(id) {
        return new Promise(async (resolve,reject)=>{
            try{
                let user= await userModelPro.findUserByID(id)
                if (user.length<=0) {
                    resolve(null)
                }
                else {
                    user=user[0]
                    resolve(user)
                }
            }catch (e){
                reject(e)
            }
        })
    }
}