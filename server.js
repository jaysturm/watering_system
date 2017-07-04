const express = require('express');
const server = express();

var defaultRoute = require('./route_methods/index');
var water = require('./route_methods/water');

server.use('/', defaultRoute);
server.post('/water', water);

server.listen(5555, () => {
  console.log("Server running at http://127.0.0.1:5555/");
});