//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//making initial mongodb connection
mongoose.connect("mongodb+srv://admin-zain:Zadmin321@cluster0-g5gwg.mongodb.net/blogDB", {useNewUrlParser: true});

//creating schema for a post obj
const postSchema = {
  title : String,
  body: String,
  url : String

}

//creating post model, thereby creating a posts collection in mongoDb

const Post = mongoose.model("Post", postSchema);

const defaultPost = new Post({
  title :"How to make a post",
  body : "go to /compose after the link in your browser search bar and make a post"
})

const defaultPosts = [defaultPost];

// let posts = [];

app.get("/",function(req,res){
    
  //finding everything in post model
  Post.find({}, function(err, foundPosts){

    if (foundPosts.length === 0) {
      Post.insertMany(defaultPosts, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default post to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("home", {homeContent : homeStartingContent, posts : foundPosts});
    }
  });


});


app.get("/about",function(req,res){

  res.render("about", {aboutContent : aboutContent});

});

app.get("/contact",function(req,res){

  res.render("contact", {contactContent : contactContent});

});

app.get("/compose",function(req,res){

  res.render("compose");

});


app.get("/posts/:postName", function(req,res)
{

  Post.find({}, function(err, foundPosts)
  {
    foundPosts.forEach(post => 
    {
      if (
        _.lowerCase([string=req.params.postName]) 
      === 
      _.lowerCase([string=post.title])
      ) 
       
      {
  
        
        let title = post.title;
        let body = post.body;
  
        res.render("post", {title : title, body: body});
        
      }



    });
  })

  
});

app.post("/compose", function(req,res){

 const post = {
   title : req.body.postTitle,
   body : req.body.postBody,
   url : "/posts/" + _.kebabCase([string = req.body.postTitle])
 }

 const posts = [post];
 Post.insertMany(posts, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully saved post to DB.");
  }
});
res.redirect("/");

});







app.listen(3000, function() {
  console.log("Server started on port 3000");
});













app.use(function (req, res, next) {
  res.status(404).render("404")
})