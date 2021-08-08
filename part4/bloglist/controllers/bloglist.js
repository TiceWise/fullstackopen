const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')

bloglistRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

bloglistRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
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

bloglistRouter.put('/:id', async (request, response) => {
    const updatedBlog = request.body

    const returnedUpdatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {new: true})
    response.json(returnedUpdatedBlog)
})

bloglistRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = bloglistRouter