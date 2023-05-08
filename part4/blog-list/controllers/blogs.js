const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "");
	}
	return null;
};

blogRouter.get("/info", async (request, response) => {
	const blogs = await Blog.find({});
	response.send(
		`<p>Blog list has ${blogs.length} blogs on it<br>${new Date()}</p>`
	);
});

blogRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
	response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogRouter.post("/", async (request, response) => {
	const body = request.body;
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}
	const user = await User.findById(decodedToken.id);

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		user: user.id,
	});
	if (body.title && body.url) {
		const savedBlog = await blog.save();

		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();

		response.status(201).json(savedBlog);
	} else {
		response.status(400).end();
	}
});

blogRouter.delete("/:id", async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id);

	response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
	const body = request.body;

	const blog = {
		title: body.title,
		author: body.author,
		likes: body.likes,
	};
	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});

	response.json(updatedBlog);
});

module.exports = blogRouter;
