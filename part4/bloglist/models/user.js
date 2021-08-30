const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "`username` to be unique"],
        required: [true, "`username` can`t be empty"],
        minLength: [3, "`username` needs at least 3 characters"],
    },
    name: String,
    passwordHash: {
        type: String,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    ],
})

userSchema.plugin(uniqueValidator)

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    },
})

module.exports = mongoose.model("User", userSchema)
