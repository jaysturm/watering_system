const express = require('express');
const server = express();

server.get('/', (req, res) => {
  res.send('You have reached the Wonka Factory API... please leave a message at the beep.');
});

server.listen(5555, () => {
  console.log("Server running at http://127.0.0.1:5555/");
})


// // Load the http module to create an http server.
// var http = require('http');

// // Configure our HTTP server to respond with Hello World to all requests.
// var server = http.createServer(function (request, response) {
//   response.writeHead(200, {"Content-Type": "text/plain"});
//   response.end("You have reached the Wonka Factory API... please leave a message at the beep.\n");
// });

// // Listen on port 5555, IP defaults to 127.0.0.1
// server.listen(5555);

// // Put a friendly message on the terminal
// console.log("Server running at http://127.0.0.1:5555/");