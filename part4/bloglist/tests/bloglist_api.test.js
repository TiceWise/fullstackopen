const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const baseRoute = '/api/blogs'

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are return as json', async () => {
    await api
        .get(baseRoute)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get(baseRoute)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get(baseRoute)

    const titles = response.body.map(r => r.title)

    expect(titles).toContain(
        'TDD harms architecture'
    )
})

test('a valid blog can be added', async () => {
    const newBlog = {
        id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }

    await api
        .post(baseRoute)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).toContain(
        newBlog.title
    )
})

test('the first blog returned has the property "id"', async () => {
    const response = await api.get(baseRoute)
    expect(response.body[0].id).toBeDefined()
    // expect(response.body[0]).toHaveProperty('id')
})

test('if likes property is missing from request, the default if defaults to the value 0', async () => {
    const newBlog = {
        id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        __v: 0
    }

    // const response = await api
    await api
        .post(baseRoute)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    // const savedBlog = response.body

    const blogsAtEnd = await helper.blogsInDb() // is the last blog always the latest added blog? or use the returned blog?
    const lastBlog = blogsAtEnd.pop()

    // expect(savedBlog.likes).toBe(0)
    expect(lastBlog.likes).toBe(0)
    // expect(savedBlog).toEqual(lastBlog)
})


test('if title and url properties are missing, the backend responds with 400 Bad Request', async () => {
    const newBlog = {
        id: '5a422bc61b54a676234d17fc',
        author: 'Robert C. Martin',
        likes: 2,
        __v: 0
    }

    // const response = await api
    await api
        .post(baseRoute)
        .send(newBlog)
        .expect(400)

})

test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
        .get(`${baseRoute}/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlogToView)
})

test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes++

    await api
        .put(`${baseRoute}/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

    const updatedBlog = await api
        .get(`${baseRoute}/${blogToUpdate.id}`)

    expect(updatedBlog.body.likes).toEqual(blogToUpdate.likes)
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`${baseRoute}/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.titles)

    expect(titles).not.toContain(blogToDelete.title)
})

afterAll(() => {
    mongoose.connection.close()
})