import {check} from "express-validator"

let validateRegister=[
    check("email","Lỗi cú pháp email").isEmail().trim(),
    check("password","Password phải có 2 ký tự trở lên")
        .isLength({min:2}),
    check("passwordConfirmation","Mật khẩu không khớp").
        custom((value,{req})=>{
    return value === req.body.password
        }),
]
export default validateRegister