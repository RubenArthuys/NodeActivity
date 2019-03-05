var express = require('express');
var app = express();
var server = require('http').Server(app);
var ent = require('ent');

var io = require('socket.io')(server);

var todoList = [];
var index;

app.use(express.static('public'))

  .get('/todo', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
  })

  .use(function(req, res, next){
    res.redirect('/todo');
  })

io.sockets.on('connection', function (socket) {

  console.log('New user connected : )');

  socket.emit('updateList', todoList);

  //Add
  socket.on('addTodo', function(todo) {

    todo = ent.encode(todo);
    todoList.push(todo);
    
    index = todoList.length -1;

    // socket.broadcast.emit('updateList', todoList);
    //Emit to all users
    socket.broadcast.emit('addTodo', {todo:todo, index:index});
  });

  //Delete
  socket.on('deleteTodo', function(index) {
    todoList.splice(index, 1);

    io.sockets.emit('updateList', todoList);
  });
});

server.listen(8080);