import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');
    const [updateBlogs, setUpdateBlogs] = useState(true);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password,
            });
            window.localStorage.setItem(
                'loggedBlogListAppUser',
                JSON.stringify(user)
            );
            blogService.setToken(user.token);
            setUser(user);
            setUsername('');
            setPassword('');
        } catch (exception) {
            setErrorMessage('Wrong username or password');
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    const createBlog = async (event) => {
        event.preventDefault();

        try {
            const newBlog = { title, author, url };
            await blogService.createBlog(newBlog);
            setAuthor('');
            setTitle('');
            setUrl('');
            setSuccessMessage(`a new blog ${title} by ${author} added`);
            setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            setUpdateBlogs(true);
        } catch (exception) {
            setErrorMessage(exception.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    useEffect(() => {
        if (updateBlogs) {
            blogService.getAll().then((blogs) => setBlogs(blogs));
        }
        setUpdateBlogs(false);
    }, [updateBlogs]);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem(
            'loggedBlogListAppUser'
        );
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    );

    const createBlogForm = () => (
        <form onSubmit={createBlog}>
            <div>
                title:
                <input
                    type="text"
                    value={title}
                    name="title"
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author:
                <input
                    type="text"
                    value={author}
                    name="author"
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url:
                <input
                    type="text"
                    value={url}
                    name="url"
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit">create</button>
        </form>
    );

    const logout = () => {
        window.localStorage.removeItem('loggedBlogListAppUser');
        setUser(null);
    };

    const blogList = () => (
        <div>
            <p>
                {user.name} logged in <button onClick={logout}>logout</button>
            </p>
            <h2>blogs</h2>
            {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
            ))}
        </div>
    );

    return (
        <div>
            <h1>Blog list</h1>
            <Notification message={errorMessage} type={'error'} />
            <Notification message={successMessage} type={'success'} />
            {user === null ? (
                loginForm()
            ) : (
                <div>
                    {createBlogForm()} {blogList()}
                </div>
            )}
        </div>
    );
};

export default App;
