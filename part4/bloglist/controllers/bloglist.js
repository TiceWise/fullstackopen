const bloglistRouter = require("express").Router()
const Blog = require("../models/blog")
const { userExtractor } = require("../utils/middleware")

bloglistRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
        id: 1,
    })
    response.json(blogs)
})

bloglistRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

bloglistRouter.post("/", userExtractor, async (request, response) => {
    const incomingBlog = request.body

    // get user from request object
    const user = request.user

    if (!("url" in incomingBlog) && !("title" in incomingBlog)) {
        return response.status(400).end()
    }

    if (!("likes" in incomingBlog)) {
        incomingBlog.likes = 0
    }

    const blog = new Blog({
        ...incomingBlog,
        user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs.push(savedBlog._id)
    await user.save()

    response.json(savedBlog)
})

bloglistRouter.put("/:id", async (request, response) => {
    const updatedBlog = request.body

    const returnedUpdatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        updatedBlog,
        { new: true }
    )
    response.json(returnedUpdatedBlog)
})

bloglistRouter.delete("/:id", userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({ error: "blog not found" })
    }
    // get user from request object
    const user = request.user

    if (!(user.id.toString() === blog.user.toString())) {
        return response
            .status(401)
            .json({ error: "user is not owner of this blog" })
    } else {
        await Blog.findByIdAndRemove(request.params.id)
        // TODO: also remove blog from user blog list
        response.status(204).end()
    }
})

module.exports = bloglistRouter
