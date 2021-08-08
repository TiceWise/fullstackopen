const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')

bloglistRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

bloglistRouter.post('/', async (request, response) => {
    const incomingBlog = request.body

    if (!('url' in incomingBlog) && !('title' in incomingBlog)) {
        return response.status(400).end()
    }

    if (!('likes' in incomingBlog)) {
        incomingBlog.likes = 0
    }

    const blog = new Blog(incomingBlog)
    const savedBlog = await blog.save()

    response.json(savedBlog)
})

module.exports = bloglistRouter