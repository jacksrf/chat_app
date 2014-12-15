var client = new WebSocket("ws://trey.princesspeach.nyc:3000");

var reminderCount = 0;
var alertCount = 0;
var userNames = [];
var online = [];



client.addEventListener("open", function(connection) {
  console.log(userNames);
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
    // online.forEach(function(user) {
    //   if (user === userName) {
    //     alertCount++;
    //     reminderCount++;
    //     if (alertCount > 0) {
    //       alert("That name is already taken!");
    //     }
    //   }
    // })


    var colorChoice = document.getElementById("ddl");
    var userColor = colorChoice.options[colorChoice.selectedIndex].value;
    var PM = document.getElementById("private");
    var target = PM.value;
    if (nameInput.value.trim() !== "" && userColor.trim() !== "") {

      var messageObject = {name: userName, msg: yourSent.value, color: userColor, loggedIn: userName, private: target};
      client.send(JSON.stringify(messageObject));
      console.log(messageObject);

      //resets input box
      yourSent.value = "";

      target = "";
      reminderCount = 0;
      alertCount = 0;



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

    console.log(userName);
    console.log(newMessage.private);
//removing a user from loggedOn list and online array(this frees up the name to be used again)
    userNames.forEach(function(user) {
      if (user === newMessage.remove) {
        console.log(newMessage.remove)
        var loggedList = document.getElementById("loggedList");
        var userRemove = document.getElementById(newMessage.remove);
        loggedList.removeChild(userRemove);
        var removeIndex = online.indexOf(newMessage.remove);
        online.splice(removeIndex, 1);

      }
    })

//letting existing users know that someone joined the chat
    if (userNames.length > 0 && newMessage.private === null) {
    var index = userNames.indexOf(newMessage.loggedIn);
      if (index === -1 && newMessage.name !== "ADMIN") {
      var chatMessages = document.getElementById("chatMessages");
      var li = document.createElement("li");

      li.style.color = "white";
      li.innerText = newMessage.name + ": has logged into the chat";
      chatMessages.insertBefore(li, chatMessages.firstChild);
    }
  }
//adding new users to the online list
    var index2 = userNames.indexOf(newMessage.loggedIn);
      if (index2 === -1 && newMessage.loggedIn !== undefined) {
        var loggedList = document.getElementById("loggedList");
        var li = document.createElement("li");

      li.style.color = "#7FFF00";
      li.innerHTML = newMessage.loggedIn;
      li.setAttribute("id", newMessage.loggedIn);
      loggedList.appendChild(li);

      online.push(newMessage.loggedIn);
    }


//adding messages and checking for links, imgs, and gifs
    var chatMessages = document.getElementById("chatMessages");
    var li = document.createElement("li");
    var a = document.createElement("a");
    var img = document.createElement("img");
    var letterCheck = newMessage.msg;
    var length = newMessage.msg.length;
    console.log(newMessage.private);
    console.log(userName);
    console.log(userNames);




if (newMessage.private === "") {
  console.log();
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
  } else if (newMessage.private !== "") {
    console.log("private");
    var nameInput = document.getElementById("userNameInput");
    var name = nameInput.value;
    var userName = name.toUpperCase();
      if(userName === newMessage.private || userName === newMessage.name) {
          var chatMessages = document.getElementById("chatMessages");
          var li = document.createElement("li");
          li.style.color = newMessage.color;
          li.innerText = "private -- " + newMessage.name + ": " + newMessage.msg;
          chatMessages.insertBefore(li, chatMessages.firstChild);
      }
  }
//adds username to array
userNames.push(newMessage.name);
  });

  logout.addEventListener("click", function() {
    var nameInput = document.getElementById("userNameInput");
    var name = nameInput.value;

    var userName = name.toUpperCase();

        var finalMessage = {name: "ADMIN", msg: "a user has left the chat", color: "white", remove: userName};
        client.send(JSON.stringify(finalMessage));
    })
});

function close_window() {
  if (confirm("Close Window?")) {
    close();
  }
}

//end connection event
