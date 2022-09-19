const blogModel = require("../models/blogModel")
const validator = require("../validators/validator")
const userModel = require("../models/userModel")
const aws = require("aws-sdk")
const multer = require("multer")



aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",  // id
    secretAccessKey: "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",  // secret password
    region: "ap-south-1"
});


// this function uploads file to AWS and gives back the url for the file
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {

        let s3 = new aws.S3({ apiVersion: "2006-03-01" });
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", // HERE
            Key: "group39/profileImages/" + file.originalname, // HERE    
            Body: file.buffer,
        };

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err });
            }
            console.log(data)
            console.log("File uploaded successfully.");
            return resolve(data.Location); //HERE 
        });
    });
};







const createBlog = async function (req, res) {
    try {

        const blogDetails = req.body
        const { title, description, category, tags } = blogDetails

        if (!(title || description || category || tags)) {
            return res.status(400).send({ status: false, msg: "Please provide all required details" })
        }

        if (!validator.isValid(title || description || category || tags)) {
            return res.status(400).send({ status: false, msg: "Please fill all the blanks carefully" })
        }
       
        let files = req.files;
        let uploadedFileURL = await uploadFile(files[0]);

        const finalDetails = { title, description, category, tags, video: uploadedFileURL }

        const savedDetails = await blogModel.create(finalDetails);

        return res.status(201).send({ status: true, msg: "Blog created successfully", data: savedDetails })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




const updateBlog = async function (req, res) {
    try {

   
        const updateInfo = req.body;
        if (!validator.isValidBody(body)) {
          return res
            .status(400)
            .send({ status: false, msg: "Details must be present to update" });
        }
    
        const {userId, blogId} = req.params;

        const userFound = await userModel.findOne({ _id: userId });
        if (!userFound) {
          return res
            .status(404)
            .send({ status: false, msg: "User does not exist" });
        }

        
        const blogFound = await blogModel.findOne({ _id: blogId });
        if (!blogFound) {
          return res
            .status(404)
            .send({ status: false, msg: "blog does not exist" });
        }


        let updatedBlog = await blogModel.findOneAndUpdate({_id:blogId}, updatedBlog, {new:true})
        return res.status(200).send({status: true, msg: "Updated Successfully", data: updatedBlog}) 

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



const deleteBlog = async function(req, res){

    try{
         const {blogId , userId} = req.params
    
    
         const userFound = await userModel.findOne({ _id: userId });
         if (!userFound) {
           return res
             .status(404)
             .send({ status: false, msg: "User does not exist" });
         }
 
         
         const blogFound = await blogModel.findOne({ _id: blogId });
         if (!blogFound) {
           return res
             .status(404)
             .send({ status: false, msg: "blog does not exist" });
         }
 
         if(blogFound.isDeleted == true){
             res.status(400).send({status : false, msg : "this blog is already deleted"})
         }
    
         const deleteBlog = await blogModel.findOneAndUpdate({_id : blogId}, {$set: {isDeleted : true , deletedAt : new Date()} }  ,{new : true} )
    
         return res.status(200).send({status : true, msg : "Blog deleted Successfully."})
    
        }
        catch(err){
            res.status(500).send({msg : err.message})
        }
    
    }



module.exports = { createBlog , updateBlog , deleteBlog }