var client = new WebSocket("ws://localhost:3000");

var reminderCount = 0;
var userName = "";
var userNames = [];

client.addEventListener("open", function(connection) {
  //HTML elements
  var body = document.querySelector("body");
  var chatMessages = document.getElementById("chatMessages");
  var loggedList = document.getElementById("loggedList");
  var submit = document.getElementById("submit");
  var logout = document.getElementById("logout");

  submit.addEventListener("click", function() {
    var yourSent = document.getElementById("textBox");

    var nameInput = document.getElementById("userNameInput");
    var name = nameInput.value;

    var userName = name.toUpperCase();

    var colorChoice = document.getElementById("ddl");
    var userColor = colorChoice.options[colorChoice.selectedIndex].value;
    if (nameInput.value.trim() !== "" && userColor.trim() !== "") {

      if (reminderCount === 0) {
        var li = document.createElement("li");
        li.style.color = userColor;
        li.innerText = "Hi " + userName + "! Remember your color is " + userColor;
        chatMessages.insertBefore(li, chatMessages.firstChild);
        reminderCount++;
      }


    //create messageObject with name and message
    var messageObject = {name: userName, msg: yourSent.value, color: userColor, loggedIn: userName};

    //take messageObject, stringify and send to server

    //will only send something if the input actually has text
    if (yourSent.value.trim() != "") {
      client.send(JSON.stringify(messageObject));
    }





    //resets input box
    yourSent.value = "";


  } else {
    alert("Please input a Username and Color");
  }
})
  // on pressing enter
  var input = document.getElementById("textBox");

  input.addEventListener("keypress", function(){
    if(event.keyCode === 13){
      submit.click();
    }
  });

  //listens for incoming messages
  client.addEventListener("message", function(message) {
    //recieves message from server and parses the data
    var newMessage = JSON.parse(message.data);

    console.log(userNames);
    console.log(newMessage.remove);

    userNames.forEach(function(user) {
      if (user === newMessage.remove) {
        console.log(newMessage.remove)
        var loggedList = document.getElementById("loggedList");
        var userRemove = document.getElementById(newMessage.remove);
        loggedList.removeChild(userRemove);
      }
    })


    if (userNames.length > 0) {
    var index = userNames.indexOf(newMessage.loggedIn);
      if (index === -1 && newMessage.name !== "ADMIN") {
      var chatMessages = document.getElementById("chatMessages");
      var li = document.createElement("li");

      li.style.color = "black";
      li.innerText = newMessage.name + ": has logged into the chat";
      chatMessages.insertBefore(li, chatMessages.firstChild);
    }
  }

    var index2 = userNames.indexOf(newMessage.loggedIn);
      if (index2 === -1 && newMessage.loggedIn !== undefined) {
        var loggedList = document.getElementById("loggedList");
        var li = document.createElement("li");

      li.style.color = "green";
      li.innerHTML = newMessage.loggedIn;
      li.setAttribute("id", newMessage.loggedIn);
      loggedList.appendChild(li);
    }



    var chatMessages = document.getElementById("chatMessages");
    var li = document.createElement("li");
    var a = document.createElement("a");
    var img = document.createElement("img");
    var letterCheck = newMessage.msg;
    var length = newMessage.msg.length;

   if (letterCheck.charAt(length-2)+letterCheck.charAt(length-1)+letterCheck.charAt(length) === "jpg" || letterCheck.charAt(length-2)+letterCheck.charAt(length-1)+letterCheck.charAt(length) === "png" ) {
      li.style.color = newMessage.color;
      a.setAttribute("href", newMessage.msg);
      a.innerText = newMessage.name + ": " + newMessage.msg;
      li.appendChild(a);
      chatMessages.insertBefore(li, chatMessages.firstChild);
    } else if (letterCheck.charAt(length-2)+letterCheck.charAt(length-1)+letterCheck.charAt(length) === "bmp" || letterCheck.charAt(length-2)+letterCheck.charAt(length-1)+letterCheck.charAt(length) === "gif" ) {
      li.style.color = newMessage.color;
      a.setAttribute("href", newMessage.msg);
      a.innerText = newMessage.name + ": " + newMessage.msg;
      li.appendChild(a);
      chatMessages.insertBefore(li, chatMessages.firstChild);
    } else if (letterCheck.charAt(0) === "h" && letterCheck.charAt(1) ==="t" && letterCheck.charAt(2) ==="t" && letterCheck.charAt(3) ==="p" ) {
      li.style.color = newMessage.color;
      img.setAttribute("height","200px")
      img.setAttribute("src", newMessage.msg);
      li.innerHTML = newMessage.name + ": ";
      li.appendChild(img);
      chatMessages.insertBefore(li, chatMessages.firstChild);
    } else {
      li.style.color = newMessage.color;
      li.innerText = newMessage.name + ": " + newMessage.msg;
      chatMessages.insertBefore(li, chatMessages.firstChild);
    }

userNames.push(newMessage.name);
  });

  logout.addEventListener("click", function() {
    var nameInput = document.getElementById("userNameInput");
    var name = nameInput.value;

    var userName = name.toUpperCase();

        var finalMessage = {name: "ADMIN", msg: "a user has left the chat", color: "black", remove: userName};
        client.send(JSON.stringify(finalMessage));
    })
});

function close_window() {
  if (confirm("Close Window?")) {
    close();
  }
}

//end connection event
