var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");
	methodOverride = require("method-override");
	expressSanitizer = require("express-sanitizer");

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog", {useNewUrlParser:true})
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type:Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title : "TEST BLOG",
// 	image : "https://images.unsplash.com/photo-1551074659-f12c57f205b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=80",
// 	body : "THIS IS A TEST BLOG BODY"
// }, function(err, blog){
// 	if(err) console.log(err);
// 	else console.log(blog);
// });

//RESTful ROUTES

//LANDING
app.get("/", function(req, res){
	res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err) console.log(err);
		else{
			//console.log(blogs);
			res.render("index", {blogs:blogs});
		}
	});
});

//NEW
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE
app.post("/blogs", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err) console.log(err);
		else{
		res.redirect("/blogs");
		}
	})
});

//SHOW
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.send(err);
		}
		else{
			res.render("show", {blog:foundBlog});
		}
	})
});

//EDIT
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.send(err);
		}
		else{
			res.render("edit", {blog:foundBlog});
		}
	});
});

//UPDATE
app.put("/blogs/:id",function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, foundBlog){
		if(err){
			res.send(err);
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//DESTROY
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err) console.log(err);
		else{
			res.redirect("/blogs");
		}
	});
});

app.listen(3000, function(req,res){
	console.log("Initiating RESTfulblogApp...");
	console.log("RESTfulblogApp initiated.");
});