var express = require('express');
var app = express();
var server = require('http').Server(app);
var ent = require('ent');

var io = require('socket.io')(server);

var todoList = [];
var index;

//Use public CSS
app.use(express.static('public'))

//Load page
  .get('/todo', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
  })

  //Redirect
  .use(function(req, res, next){
    res.redirect('/todo');
  })

//Socket.io
io.sockets.on('connection', function (socket) {

  console.log('New task to do?');

  socket.emit('updateList', todoList);

  //Add
  socket.on('addTodo', function(todo) {

    todo = ent.encode(todo);
    todoList.push(todo);
    
    index = todoList.length -1;

    //Emit to all users
    socket.broadcast.emit('addTodo', {todo:todo, index:index});

    //Simpler option:
    // socket.broadcast.emit('updateList', todoList);
  });

  //Delete
  socket.on('deleteTodo', function(index) {
    todoList.splice(index, 1);

    io.sockets.emit('updateList', todoList);
  });
});

server.listen(8080);