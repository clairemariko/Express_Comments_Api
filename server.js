var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/comment_application';

//allowing cors origin, the request can come from anywhere
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/comments', function(req,res){
  MongoClient.connect(url, function(err, db) {
    var collection = db.collection('comments');
    collection.find({}).toArray(function(err, docs) {
      res.json(docs);
      db.close();
    });
  });
})

app.post('/api/comments', function(req,res){
  MongoClient.connect(url, function(err, db) {
    var collection = db.collection('comments');
    collection.insert(
      { "author": req.body.author,
        "text": req.body.text,
      }
    )
    res.status(200).end()
    db.close();
  });
})

//we are deleteing this as it is not concerned about html it is going to be a pure server file. 

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

// app.use(express.static('client/build'));

//prev we only had one server set on 30000 and now this is two servers so it has to be different.
var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});