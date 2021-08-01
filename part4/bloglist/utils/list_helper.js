const bloglistRouter = require("../controllers/bloglist")

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogList) => {
  const reducer = (sum, blog) => {
    // console.log(sum)
    // console.log(blog.likes)
    // console.log(typeof(blog.likes))
    return blog.likes
      ? sum + blog.likes
      : sum + 0
  }

  return blogList.length === 0
    ? 0
    : blogList.reduce(reducer, 0)
}

const favoriteBlog = (blogList) => {

  if (isEmpty(blogList[0])) {
    return {}
  }

  const initialBlog = {likes: -1}
  
  const reducer = (currentFavoriteBlog, blog) => {
    // console.log(blog.likes)
    // console.log(currentFavoriteBlog.likes)
    if (blog.likes > currentFavoriteBlog.likes) {
      return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
    } else {
      return currentFavoriteBlog
    }
  }

  return blogList.reduce(reducer, initialBlog)

}

const mostBlogs =(blogList) => {

  let blogCountDict = {}
  let mostBlogsOut = {
    author: "",
    blogs: 0
  }

  if (isEmpty(blogList[0])) {
    return {}
  }

  // for each blog
  blogList.forEach(blog => {
    // determine if author is in dict
    blog.author in blogCountDict
      // if so, increase count
      ? blogCountDict[blog.author]++
      // if not, add to dict, set count to one
      : blogCountDict[blog.author] = 1
    
    // track max, if new max, then update
    if (blogCountDict[blog.author] > mostBlogsOut.blogs) {
      mostBlogsOut.blogs = blogCountDict[blog.author]
      mostBlogsOut.author = blog.author
      // console.log(mostBlogsOut)
    } 
  })

  // console.log(blogCountDict)
  return mostBlogsOut   
}

const mostLikes =(blogList) => {

  let likeCountDict = {}
  let mostLikesOut = {
    author: "",
    likes: 0
  }

  if (isEmpty(blogList[0])) {
    return {}
  }

  // for each blog
  blogList.forEach(blog => {
    // determine if author is in dict
    blog.author in likeCountDict
      // if so, increase count
      ? likeCountDict[blog.author] += blog.likes
      // if not, add to dict, set count to one
      : likeCountDict[blog.author] = blog.likes
    
    // track max, if new max, then update
    if (likeCountDict[blog.author] > mostLikesOut.likes) {
      mostLikesOut.likes = likeCountDict[blog.author]
      mostLikesOut.author = blog.author
      // console.log(mostBlogsOut)
    } 
  })

  // console.log(likeCountDict)
  return mostLikesOut   
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}