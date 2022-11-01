//creating the express app
let express = require('express'); // include the express module here, and store in the variable "express"
let app = express();

app.use("/", express.static("public"));

//creating the http server
let http = require("http");
let server = http.createServer(app);

//setup socket sonnections
let io = require("socket.io");
io = new io.Server(server);

//listen for connections
io.sockets.on("connection", (socket)=>{
    console.log("client connected", socket.id);

	//".on" getting "data", "emit" to all C
  socket.on("data", (data) => {
    console.log(data);
    io.sockets.emit("dataFromServer", data);
  })

    //listen for when the socket discunnects
    socket.on("disconnect", ()=>{
        console.log("client disconnected", socket.id);
    })
})

//run the app on the port 3000
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("server is running at localhost:3000");
  })