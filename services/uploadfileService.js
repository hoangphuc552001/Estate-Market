import userModelPro from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import http from "https";
import util from "util";
import cloudinary from "../utils/image.js"
export default {
    //path: đường dẫn tới hình
    //dir: đường dẫn folder trên cloudinary
      uploadImage(path,dir) {
          cloudinary.uploader.upload(path,{
              resource_type: "image",public_id: dir,
              overwrite: true
          });
      },
    removeImage(dir){
        cloudinary.uploader.destroy(dir);
    }
}