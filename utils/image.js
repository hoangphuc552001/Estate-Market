

import dotenv from "dotenv";
dotenv.config();
import http from "https";
import { v2 as cloudinary } from 'cloudinary';
import Formidable from'formidable'
import util from 'util'


cloudinary.config({
    cloud_name: 'dj8sborcb',
    api_key: '993397892481551',
    api_secret: '7H2Wj904VchX8lNlK59PPPPMmo0',
    secure: true
});


export default cloudinary;
