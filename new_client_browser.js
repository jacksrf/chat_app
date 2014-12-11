var client = new WebSocket("ws://localhost:3000");

var name = prompt("Please Enter A User Name!");
console.log(userName);
var userColor = prompt("What is your favorite color?");
console.log(userColor);
var userName = name.toUpperCase();

client.addEventListener("open", function(connection) {
  console.log('connected');

  //HTML elements
  var body = document.querySelector("body");
  var ul = document.querySelector("ul");
  var button = document.querySelector("button");

  var li = document.createElement("li");
  li.style.color = userColor;
  li.innerText = "Hi " + userName + "! Remember your color is " + userColor;
  ul.insertBefore(li, ul.firstChild);

  button.addEventListener("click", function() {
    var yourSent = document.getElementById("textBox");
    //create messageObject with name and message
    var messageObject = {name: userName, msg: yourSent.value, color: userColor};
    //take messageObject, stringify and send to server

    //will only send something if the input actually has text
    if (yourSent.value.trim() != "") {
      client.send(JSON.stringify(messageObject));
    }

    //resets input box
    yourSent.value = "";
  })

  // on pressing enter
  var input = document.querySelector("input");

  input.addEventListener("keypress", function(){
    if(event.keyCode === 13){
      button.click();
    }
  });

  //listens for incoming messages
  client.addEventListener("message", function(message) {
    //recieves message from server and parses the data
    var newMessage = JSON.parse(message.data);
    console.log(newMessage);
    var ul = document.querySelector("ul");
    var li = document.createElement("li");

    // if (newMessage.length === 1) {
      li.style.color = newMessage.color;
      li.innerText = newMessage.name + ": " + newMessage.msg;
      //this will put the list element at the top of the list
      ul.insertBefore(li, ul.firstChild);
    // } else {
    //   for (i=0; i<newMessage.length; i++) {
    //     li.style.color = newMessage[i].color;
    //     li.innerText = newMessage[i].name + ": " + newMessage[i].msg;
    //     //this will put the list element at the top of the list
    //     ul.insertBefore(li, ul.firstChild);
    //   }
    //  }
  });


});//end connection event
