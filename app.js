var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false});
// var path = require ('path');

var app = express();
app.set('view engine', 'ejs');
// CSS-Js-Static loading
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', __dirname + '/views');

app.use(session({secret: 'todosecret'}))

.use(function(req, res, next) {
  if (typeof(req.session.todolist) == 'undefined') {
    req.session.todolist = [];
  }
  next();
})

.get('/todo', function(req, res) {
  res.render('index.ejs', {todolist: req.session.todolist});
})

.post('/todo/add/', urlencodeParser, function(req, res) {
  if (req.body.newtodo != '') {
    req.session.todolist.push(req.body.newtodo);
  }
  res.redirect('/todo');
})

.get('/todo/delete/:id', function(req, res) {
  if (req.params.id != '') {
    req.session.todolist.splice(req.params.id, 1);
  }
  res.redirect('/todo');
})

.use(function(req, res, next){
  res.redirect('/todo');
})

.listen(8080);