import dataUriParser from 'datauri/parser.js';
import ErrorHandler from '../utils/ErrorHandler.js'
import path from 'path'
import cloudinary from 'cloudinary';
export const upload = async(file,next)=>{
    const data_uri = getUri(file);
    let myCloud;
    try {
        myCloud = await cloudinary.v2.uploader.upload(data_uri.content);
        return myCloud.url;
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message,500));
    }
}
const getUri = (file)=>{
    const parser = new dataUriParser();
    const extname = path.extname(file.originalname);
    return parser.format(extname,file.buffer);
}