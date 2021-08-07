const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')

bloglistRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

bloglistRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const savedBlog = await blog.save()
    response.json(savedBlog)
})

module.exports = bloglistRouter