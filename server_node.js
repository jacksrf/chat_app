var WSS = require("ws").Server;
var server = new WSS({port: 3000});

var clients = [];
var history = [];

server.on("connection", function(connected) {

  clients.forEach(function(client) {
    var newPerson = {name: "user[]", msg: "has joined the chat", color: "black"}
    client.send(JSON.stringify(newPerson));
  })

  clients.push(connected);
  console.log(clients.length);
  // if (clients.length === 1){
  //   var welcomeOne = {msg : "You are the only one connected!"}
  //   connected.send(JSON.stringify(welcomeOne));
  // } else {
  // clients.forEach(function(client) {
  //   var welcomeOthers = {msg: "someone else just connected -- " + clients.length + " people connected" }
  //   client.send(JSON.stringify(welcomeOthers));
  //   });
  // }
  if (history.length > 0) {
    history.forEach(function(msg){
    connected.send(JSON.stringify(msg));
    })
  }

  connected.on("message", function(message) {
    // var messageObject = JSON.parse(message)
    // console.log(messageObject);
    // var serverMessage = (messageObject.name + ": " + messageObject.msg);
    // console.log(serverMessage);


    history.push(message);
    // var tempClients = [];
    clients.forEach(function(client) {
        client.send(message);
    // })
    // var x = tempClients.indexOf(connected)
    // tempClients.splice(x, 1);
    // tempClients.forEach(function(client) {
      // if (msg == "table flip") {
      //   client.send("(╯°□°）╯︵ ┻━┻");
      // } else if (msg == "sniper rifle"){
      //   client.send("︻デ┳═ー");
      // } else {
      })
  });

  connected.on('close', function () {
    var x = clients.indexOf(connected);
    console.log(x);
    clients.splice(x, 1);
    console.log('User ' + x + ' has disconnected');
    console.log(clients.length);
    });
});
