import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
    });

    


const uploadOnCloudinary=async (localFilePath)=>{
     try{
        if(!localFilePath) return null;
        // for uploading the file to cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto" //here resourse_type is which file is coming...we have set it to auto.
        })
        // file has uploaded successfully

        console.log("file is uploaded successfully to cloudinary",response.url);
        return response;
     }catch(error){
        fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload operation got failed
        return null;
     }
}

export {uploadOnCloudinary}

