const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

////Requested To Perform Query For All Articles////

//Get All Articles
app.route("/articles")
.get(function(req, res) {
    Article.find({}, function(err, foundArticle) {
      if (err) {
        res.send(error);
      } else {
        res.send(foundArticle);
      }
    });
  })
  //Add New Article With use of API And Stored in "article" Collection in Robo3T
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Suceesfully added new article in DB");
      } else {
        res.send(err);
      }
    });
  })
  //Delete All Articles
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Delete Articles Successfully!");
      } else {
        res.send(err);
      }
    });
  });

////Requested To Perform Query For Specific Article////
app.route("/articles/:articleTitle")

//Get Specific Article From Express Routing
.get(function(req,res) {
  Article.findOne({title:req.params.articleTitle}, function(err,foundArticle){
    if(foundArticle) {
      console.log(foundArticle);
      res.send(foundArticle);
    }
    else{
      res.send("Not Found!!");
    }
  });
})

// Update Whole Article
.put(function(req,res) {
  Article.update(
  {title:req.params.articleTitle},
  {title:req.body.title,content:req.body.content},
  {overWrite:true},
  function(err){
    if(!err){
      res.send("Successfully update Article.");
    }
    else{
      res.send("Due to Error Ocurred Article is not updated!!");
    }
  }
);
})

// Update Specific Article Fields
.patch(function(req,res){
  Article.updateMany(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Update Specific Article!");
      }
      else{
        res.send(err);
      }
    }
  )
})

//Delete Specific Article
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
    if(!err){
      res.send("Delete Selected Article");
    }
    else{
      res.send("error Ocurred!");
    }
  }
);
});

app.listen(3000, function(req, res) {
  console.log("server is running on port 3000");
});
