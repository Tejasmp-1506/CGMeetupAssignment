const jwt = require("jsonwebtoken");


let authenticate = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token)
            return res.status(400).send({ status: false, msg: "please provide token" })

        let validateToken = jwt.verify(token, 'MySercetKey')
        if (!validateToken)
            return res.status(401).send({ status: false, msg: "authentication failed" })

        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }

}

module.exports = { authenticate }