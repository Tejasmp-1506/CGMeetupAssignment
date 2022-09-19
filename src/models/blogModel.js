const mongoose = require("mongoose")


const blogSchema = new mongoose.Schema(
    {
        title: {
            type : String,
            required : true,
            trim : true
        },
        description: {
            type : String,
            required : true,
            trim : true
        },
        video: {
            type : String,
            required : true,
            trim : true
        },
        category: {
            type : String,
            required : true,
            trim : true
        },
        tags: {
            type : Array,
            required : true,
            trim : true
        },
        isDeleted: {
            type :String,
            default : false
        }
    },{timestamps: true}
)



module.exports = mongoose.model('blog', blogSchema)