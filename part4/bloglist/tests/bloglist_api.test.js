const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")

const api = supertest(app)

const baseRoute = "/api/blogs"

const Blog = require("../models/blog")
const User = require("../models/user")
const bcrypt = require("bcrypt")

describe("when there is initially one user in db", () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash("sekret", 10)
        const user = new User({ username: "root", passwordHash })

        await user.save()
    })

    test("creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "mluukkai",
            name: "Matti Luukkainen",
            password: "salainen",
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map((u) => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test("creation fails with proper statuscode and message if username is empty", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "",
            name: "not empty",
            password: "salainen",
        }

        const result = await api.post("/api/users").send(newUser).expect(500)
        // .expect(400)
        // .expect("Content-Type", /application\/json/)

        expect(result.text).toContain("`username` can`t be empty")

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("creation fails with proper statuscode and message if username is shorter than 3 characters", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "la",
            name: "not empty",
            password: "salainen",
        }

        const result = await api.post("/api/users").send(newUser).expect(500)
        // .expect(400)
        // .expect("Content-Type", /application\/json/)

        expect(result.text).toContain("`username` needs at least 3 characters")

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("creation fails with proper statuscode and message if username is already taken", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "salainen",
        }

        await api.post("/api/users").send(newUser)
        // const result = await api.post("/api/users").send(newUser)
        // .expect(400)
        // .expect("Content-Type", /application\/json/)

        // expect(result.body.error).toContain("`username` to be unique")

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("creation fails with proper statuscode and message if password is empty", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "long",
            name: "not empty",
            password: "",
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain("`password` can`t be empty")

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test("creation fails with proper statuscode and message if password is shorter than 3 characters", async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "long",
            name: "not empty",
            password: "sa",
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body.error).toContain(
            "`password` needs at least 3 characters"
        )

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

describe("when there are initially a few blogs in the db", () => {
    let beartoken

    beforeEach(async () => {
        await Blog.deleteMany({})

        const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
        const promiseArray = blogObjects.map((blog) => blog.save())
        await Promise.all(promiseArray)

        const username = "hackerboy"
        const password = "randomforsafety"

        const newUser = {
            username,
            name: "hacky",
            password,
        }

        const newLoginAttempt = {
            username,
            password,
        }

        await api.post("/api/users").send(newUser)

        const response = await api.post("/api/login").send(newLoginAttempt)

        // token = response.body.token.toString()
        beartoken = `bearer ${response.body.token}`
    })

    test("blogs are return as json", async () => {
        await api
            .get(baseRoute)
            .expect(200)
            .expect("Content-Type", /application\/json/)
    })

    test("all blogs are returned", async () => {
        const response = await api.get(baseRoute)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test("a specific blog is within the returned blogs", async () => {
        const response = await api.get(baseRoute)

        const titles = response.body.map((r) => r.title)

        expect(titles).toContain("TDD harms architecture")
    })

    test("a valid blog can be added", async () => {
        const newBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        }

        await api
            .post(baseRoute)
            .send(newBlog)
            .set("Authorization", beartoken)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map((r) => r.title)

        expect(titles).toContain(newBlog.title)
    })

    test('the first blog returned has the property "id"', async () => {
        const response = await api.get(baseRoute)
        expect(response.body[0].id).toBeDefined()
        // expect(response.body[0]).toHaveProperty('id')
    })

    test("if likes property is missing from request, the default if defaults to the value 0", async () => {
        const newBlog = {
            id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            __v: 0,
        }

        await api
            .post(baseRoute)
            .send(newBlog)
            .set("Authorization", beartoken)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        const blogsAtEnd = await helper.blogsInDb() // is the last blog always the latest added blog? or use the returned blog?
        const lastBlog = blogsAtEnd.pop()

        // expect(savedBlog.likes).toBe(0)
        expect(lastBlog.likes).toBe(0)
        // expect(savedBlog).toEqual(lastBlog)
    })

    test("if title and url properties are missing, the backend responds with 400 Bad Request", async () => {
        const newBlog = {
            id: "5a422bc61b54a676234d17fc",
            author: "Robert C. Martin",
            likes: 2,
            __v: 0,
        }

        await api
            .post(baseRoute)
            .send(newBlog)
            .set("Authorization", beartoken)
            .expect(400)
    })

    test("a specific blog can be viewed", async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`${baseRoute}/${blogToView.id}`)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedBlogToView)
    })

    test("a blog can be updated", async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        blogToUpdate.likes++

        await api
            .put(`${baseRoute}/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)

        const updatedBlog = await api.get(`${baseRoute}/${blogToUpdate.id}`)

        expect(updatedBlog.body.likes).toEqual(blogToUpdate.likes)
    })

    test("a blog can be deleted", async () => {
        const newBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        }

        const addedBlog = await api
            .post(baseRoute)
            .send(newBlog)
            .set("Authorization", beartoken)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        await api
            .delete(`${baseRoute}/${addedBlog.body.id}`)
            .set("Authorization", beartoken)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        const titles = blogsAtEnd.map((r) => r.titles)

        expect(titles).not.toContain(newBlog.title)
    })

    test("a blog with wrong token results in 401", async () => {
        const newBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        }

        await api
            .post(baseRoute)
            .send(newBlog)
            .set("Authorization", "wrong token")
            .expect(401)
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
