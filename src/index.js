const net = require("net");


const HOST = "localhost"; // parameterize the IP of the Listen
const PORT = 25500; // TCP LISTEN port


// Create an instance of the Server and waits for a conexão
net.createServer(function(sock) {


	// Receives a connection - a socket object is associated to the connection automatically
	console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);


	// Add a 'data' - "event handler" in this socket instance
	sock.on("data", function(data) {
		// data was received in the socket 
		// Writes the received message back to the socket (echo)
		console.log(JSON.parse(data));
		// sock.write(data);
	});


	// Add a 'close' - "event handler" in this socket instance
	sock.on("close", function() {
		// closed connection
		console.log("CLOSED: " + sock.remoteAddress + " " + sock.remotePort);
	});


}).listen(PORT, HOST);


console.log("Server listening on " + HOST + ":" + PORT);
