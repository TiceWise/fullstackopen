const jwt = require("jsonwebtoken")
const User = require("../models/user")

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("authorization")
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        request.token = authorization.substring(7)
    } else {
        request.token = null
    }
    next()
}

const userExtractor = async (request, response, next) => {
    const authorization = request.get("authorization")

    const token =
        authorization && authorization.toLowerCase().startsWith("bearer ")
            ? authorization.substring(7)
            : null

    let decodedToken
    if (token) {
        decodedToken = jwt.verify(token, process.env.SECRET)
    } else {
        return response.status(401).json({ error: "tokein missing or invalid" })
    }

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: "token missing or invalid" })
    } else {
        request.user = await User.findById(decodedToken.id)
    }
    next()
}

module.exports = { tokenExtractor, userExtractor }
