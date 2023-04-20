// easy chat desk ws server, for loging in chats

var WebSocketServer = require('ws').Server;   // webSocket library
var mysql = require('mysql')
 

// realise connection on database
var db = mysql.createConnection({
    host: 'localhost',
    user: 'dev',
    database: 'dev_wordpress',
    password: 'V2cljC59tvVXVgc'
})


db.connect(function(err){
    if (err) console.log(err)
	else console.log("Connected to database. OK!....")
})


//------------------------------------------------

// configure the webSocket server:
const wssPort =  8081;             // port number for the webSocket server
const wss = new WebSocketServer({port: wssPort}); // the webSocket server
var clients = new Array;         // list of client connections


//const crypto = require('crypto')
console.log("Starting node server on easychatdesk")
console.log("------------------------------")
console.log("Waiting for customer connections...")


// ------------------------ webSocket Server functions

function handleConnection(client, request) 
{
	console.log("New Connection");        // you have a new client
	//clients.push(client);    // add this client to the clients arra
	//console.log(request.headers);

	const ip = request.headers['cf-connecting-ip']; 
	
 

	function endClient() 
	{
		// when a client closes its connection
		// get the client's position in the array
		// and delete it from the array:
		var position = clients.indexOf(client);
		clients.splice(position, 1);
		console.log("connection closed");
	} 

	// this executes when a client is sending a message
	function clientResponse(data) 
	{
		//console.log(request.connection.remoteAddress + '-:- ' + data);
            try
            {

                var received = JSON.parse(data);
                console.log(received);
                
                if(received.action == "connection")
                {
                    const payload = received.payload
                    console.log("Received pid: " + payload.pid)
                }
		
                

 
            }
            catch(e)
            {
                console.log("received wrong format")
            }

 
	}

	// set up client event listeners:
	client.on('message', clientResponse);
	client.on('close', endClient);
}

//--------------------

// This function broadcasts messages to all webSocket clients
function broadcast(data) {
	// iterate over the array of clients & send data to each
	for (c in clients) {
		clients[c].send(JSON.stringify(data));
	}
}

// listen for clients and handle them:
wss.on('connection', handleConnection);
