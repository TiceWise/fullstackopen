// const jwt = require("jsonwebtoken")
// const bcrypt = require("bcrypt")
// const loginRouter = require("express").Router()
// const User = require("../models/user")
//
// loginRouter.post("/", async (request, response) => {
//     const body = request.body
//
//     const user = await User.findOne({ username: body.username })
//     const passwordCorrect =
//         user === null
//             ? false
//             : await bcrypt.compate(body.password, user.passwordHash)
// })
