const userModel = require("../models/userModel")
const validator = require("../validators/validator")
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







const signUp = async function (req, res) {
    try {

        const userDetails = req.body
       
        if (!(userDetails)) {
            return res.status(400).send({ status: false, msg: "Please provide all required details" })
        }

        const { name, email, userName, phone, password } = userDetails

        if (!validator.isValid(name || email || userName || phone || password)) {
            return res.status(400).send({ status: false, msg: "Please fill all the blanks carefully" })
        }

        if (!validator.isValidName(name)) {
            return res.status(400).send({ status: false, msg: "please provide valid first name" });
        }

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "please provide valid email id" });
        }


        const duplicateEmail = await userModel.findOne({ email: email });

        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: "email id already exist. Please provide another email id", });
        }

        if (!validator.isValiduserName(userName)) {
            return res.status(400).send({ status: false, msg: "please provide username starting from letters containing numbers and symbols" });
        }

        const duplicateuserName = await userModel.findOne({ userName: userName });


        if (duplicateuserName) {
            return res.status(400).send({ status: false, msg: "userName already exist. Please provide another", });
        }

        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "please provide valid password containing capital and small letters, symbols  and letters." });
        }

        const encryptPassword = await bcrypt.hash(password, 10);

        if (!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, msg: "please provide valid phone number" });
        }

        const duplicatePhone = await userModel.findOne({ phone: phone });

        if (duplicatePhone) {
            return res.status(400).send({ status: false, msg: "phone no already exist. Please provide another phone no" });
        }

        let files = req.files;
        let uploadedFileURL = await uploadFile(files[0]);

        const finalDetails = { name, email, userName, phone, profileImage: uploadedFileURL, password: encryptPassword }

        const savedDetails = await userModel.create(finalDetails);

        return res.status(201).send({ status: true, msg: "User sign up successfully", data: savedDetails })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


const signIn = async function (req, res) {
    try {
        const loginDetails = req.body

        if (!loginDetails) {
            return res.status(400).send({ status: false, msg: "Please provide login details" })
        }

        const { email, password } = loginDetails

        if (!(email || password)) {
            return res.status(400).send({ status: true, msg: "Please provide email and password" })
        }

        if (!validator.isValid(email || password)) {
            return res.status(400).send({ status: false, msg: "Please fill the blanks carefully" })
        }

        if (email && password) {
            let userDetails = await userModel.findOne({ email });
            if (!userDetails) {
                return res.status(400).send({ status: false, msg: "user does not exist" });
            }

            let verifiedPass = await bcrypt.compare(password, userDetails.password);
            if (verifiedPass) {
                let payload = { _id: userDetails._id };
                let token = jwt.sign(payload, "MySercetKey", { expiresIn: "300m" });
                return res.status(200).send({ status: true, msg: "User login successfully", data: token })
            }
            else {
                return res.status(400).send({ status: false, msg: "Invalid password" })
            }
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const getProfileDetails = async function (req, res) {

    try {
        let name = req.query.name
        let userName = req.query.userName

        let data = {}

        if (name) {
            let searchByName = await userModel.find({ name: name })
            if (searchByName.length != 0) {
                return res.status(200).send({ status: false, data: searchByName })
            } else {
                res.status(404).send({ status: false, msg: "user not found with this name" })
            }
        }

        if (userName) {
            let searchByuserName = await userModel.find({ userName: userName })
            if (searchByuserName.length != 0) {
                return res.status(200).send({ status: true, data: searchByuserName })
            } else {
                res.status(404).send({ status: false, msg: "user not found with this username" })
            }
        }


        let finalResult = await applicationModel.find({ data })

        if (finalResult) {
            res.status(200).send({ status: true, data: finalResult })
        } else {
            res.status(404).send({ status: false, msg: "No users found" })
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}




module.exports = { signUp, signIn, getProfileDetails }