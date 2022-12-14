const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

require("dotenv").config();

// Local database
// mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
// Remote database
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const postsSchema = {
  title: {
    type: String,
    required: (1, "A title is needed!")
  },
  description: {
    type: String,
    required: (1, "A description is needed!")
  }
};
const Post = mongoose.model("post", postsSchema);


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



app.get("/", function (req, res) {
  Post.find({}, function (err, foundPosts) {
    if (err) {
      console.log(err);
    }

    res.render("home", { posts: foundPosts });
  });
});

app.get("/home", function (req, res) {
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.posttitle,
    description: req.body.postdescription
  });

  post.save();
  res.redirect("/");
});

app.get("/posts/:postID", function (req, res) {
  //fazer a pesquisa pelo ID
  const paramID = req.params.postID;
  Post.findOne({_id: paramID}, function (err, foundPost) {
    if(!err){
      if (foundPost) {
        res.render("post", {
          title: foundPost.title,
          description: foundPost.description
        });
      } else {
        // need to redirect to an error page
        console.log("Post not found");
      }
    } else {
      // need to redirect to an error page
      console.log(err);
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server is running...");
});
