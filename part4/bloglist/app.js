const config = require("./utils/config")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const bloglistRouter = require("./controllers/bloglist")
const usersRouter = require("./controllers/users")
const logger = require("./utils/logger")
const mongoose = require("mongoose")
const loginRouter = require("./controllers/login")

// app.use(middleware.tokenExtractor)
// app.use(middleware.userExtractor)

logger.info("connecting to", config.MONGODB_URI)

// mongoose.set("debug", true)

mongoose
    .connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        logger.info("connected to MongoDB")
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message)
    })

app.use(cors())
app.use(express.json())

app.use("/api/blogs", bloglistRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

module.exports = app
