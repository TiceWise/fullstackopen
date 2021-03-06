const listHelper = require('../utils/list_helper')

const emptyBlogList = [{}]

const listWithOneBlog = [
    {
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listManyBlogs = [
    {
        id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }  
]

const listWithOneBlogFavorite = {
    title: listWithOneBlog[0].title,
    author: listWithOneBlog[0].author,
    likes: listWithOneBlog[0].likes
}

const listWithManyBlogsFavorite = {
    title: listManyBlogs[2].title,
    author: listManyBlogs[2].author,
    likes: listManyBlogs[2].likes
}

const listWithOneBlogMost = {
    author: listWithOneBlog[0].author,
    blogs: 1
}

const listWithManyBlogsMost = {
    author: listManyBlogs[5].author,
    blogs: 3
}

const listWithOneBlogLikes = {
    author: listWithOneBlog[0].author,
    likes: listWithOneBlog[0].likes
}

const listWithManyBlogsLikes = {
    author: listManyBlogs[2].author,
    likes: (listManyBlogs[1].likes + listManyBlogs[2].likes)
}

test('dummy returns one', () => {
    const result = listHelper.dummy(emptyBlogList)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('of empy list is zero', () => {
        const result = listHelper.totalLikes(emptyBlogList)
        expect(result).toBe(0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('of a bigger list is caclulated right', () => {
        const result = listHelper.totalLikes(listManyBlogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {

    test('of empy list is zero', () => {
        const result = listHelper.favoriteBlog(emptyBlogList)
        expect(result).toEqual({})
    })

    test('when list has only one blog, returns that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlogFavorite)
    })

    test('of a bigger list is caclulated right', () => {
        const result = listHelper.favoriteBlog(listManyBlogs)
        expect(result).toEqual(listWithManyBlogsFavorite)
    })
})

describe('most blogs', () => {

    test('of empy list is zero', () => {
        const result = listHelper.mostBlogs(emptyBlogList)
        expect(result).toEqual({})
    })

    test('when list has only one blog, returns that author and 1 blog', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual(listWithOneBlogMost)
    })

    test('of a bigger list is determined right', () => {
        const result = listHelper.mostBlogs(listManyBlogs)
        expect(result).toEqual(listWithManyBlogsMost)
    })
})

describe('most likes', () => {

    test('of empy list is zero', () => {
        const result = listHelper.mostLikes(emptyBlogList)
        expect(result).toEqual({})
    })

    test('when list has only one blog, returns that author and likes', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual(listWithOneBlogLikes)
    })

    test('of a bigger list is determined right', () => {
        const result = listHelper.mostLikes(listManyBlogs)
        expect(result).toEqual(listWithManyBlogsLikes)
    })
})