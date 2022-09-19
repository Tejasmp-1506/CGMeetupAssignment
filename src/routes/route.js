const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const blogController = require("../controllers/blogController")
const middleware = require("../middlewares/auth")




router.post('/signUp', userController.signUp)

router.post('/signIn', userController.signIn)

router.post('/getAllProfiles', userController.getProfileDetails)


router.post('/createBlog', blogController.createBlog )

router.put('/updateBlog/:userId/:blogId', blogController.updateBlog)

router.delete('/deleteBlog/:userId/:blogId', blogController.deleteBlog)





module.exports = router;