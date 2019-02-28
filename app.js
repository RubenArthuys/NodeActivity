var app = require('express')();
var server = require('http').Server(app);
var session = require('cookie-session');

var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false});
var io = require('socket.io')(server);
  
app.set('view engine', 'ejs');

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

io.sockets.on('connection', function (socket, pseudo) {

  socket.on('nouveau_client', function(pseudo) {
    pseudo = ent.encode(pseudo);
    socket.pseudo = pseudo;
    socket.broadcast.emit('nouveau_client', pseudo);
  });

  socket.on('todo', function(todo) {
    todo = ent.encode(todo);
    socket.broadcast.emit('todo', {pseudo: socket.pseudo, todo: todo});
    console.log(todo);
  });
});

server.listen(8080);