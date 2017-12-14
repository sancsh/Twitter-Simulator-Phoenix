// // NOTE: The contents of this file will only be executed if
// // you uncomment its entry in "web/static/js/app.js".

// // To use Phoenix channels, the first step is to import Socket
// // and connect at the socket path in "lib/my_app/endpoint.ex":
// import {Socket} from "phoenix"

// let socket = new Socket("/socket", {params: {token: window.userToken}})

// // When you connect, you'll often need to authenticate the client.
// // For example, imagine you have an authentication plug, `MyAuth`,
// // which authenticates the session and assigns a `:current_user`.
// // If the current user exists you can assign the user's token in
// // the connection for use in the layout.
// //
// // In your "web/router.ex":
// //
// //     pipeline :browser do
// //       ...
// //       plug MyAuth
// //       plug :put_user_token
// //     end
// //
// //     defp put_user_token(conn, _) do
// //       if current_user = conn.assigns[:current_user] do
// //         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
// //         assign(conn, :user_token, token)
// //       else
// //         conn
// //       end
// //     end
// //
// // Now you need to pass this token to JavaScript. You can do so
// // inside a script tag in "web/templates/layout/app.html.eex":
// //
// //     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
// //
// // You will need to verify the user token in the "connect/2" function
// // in "web/channels/user_socket.ex":
// //
// //     def connect(%{"token" => token}, socket) do
// //       # max_age: 1209600 is equivalent to two weeks in seconds
// //       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
// //         {:ok, user_id} ->
// //           {:ok, assign(socket, :user, user_id)}
// //         {:error, reason} ->
// //           :error
// //       end
// //     end
// //
// // Finally, pass the token to the Socket constructor as above.
// // Or, remove it from the constructor if you don't care about
// // authentication.

// socket.connect()

// // Now that you are connected, you can join channels with a topic:
// let channel = socket.channel("topic:subtopic", {})
// channel.join()
//   .receive("ok", resp => { console.log("Joined successfully", resp) })
//   .receive("error", resp => { console.log("Unable to join", resp) })

// export default socket


import {Socket} from "phoenix"

let socket = new Socket("/socket", {});

socket.connect();

let channel = socket.channel("twitter", {});
var username = '';

$(".dashboard").hide();

if(document.getElementById("loginButton")){
  document.getElementById("loginButton").onclick = function(){
    let username = $("#inputUsername").val();
    let password = $("#inputPassword").val();
    channel.push('login_user', {username: username, password: password});  
  };
}

if(document.getElementById("registerButton")){
  document.getElementById("registerButton").onclick = function(){
    let username = $("#inputUsername").val();
    let password = $("#inputPassword").val();
    channel.push('register_user', {username: username, password: password});  
  };
}

if(document.getElementById("tweetButton")){
  document.getElementById("tweetButton").onclick = function(){
    let tweetText = $("#tweetTextbox");
    console.log(tweetText);
    channel.push('tweet', {username: username, tweetText: tweetText.val()});  
  };
}

if(document.getElementById("searchQueryButton")){
  document.getElementById("searchQueryButton").onclick = function(){
    let query = $("#searchBar").val();
    if(query[0] == '#'){
      channel.push("getTweetsByHashtag", {hashtag: query.substring(1)});
    }
    else if(query[0] == '@'){
      channel.push("getTweetsByHandle", {handle: query.substring(1)});
    }
  };
}

if(document.getElementById("followButton")){
  document.getElementById("followButton").onclick = function(){
    let subscribedUser = $("#followinput").val();
    $("#followinput").val('');
    channel.push("subscribeTo", {username: username, subscribedUser: subscribedUser});
  };
}


channel.on("Login", function(payload){
  username = payload["username"];
  //channel.push("getAllTweets", {username: username});
  console.log(payload);
  if(payload["status"] == "OK"){
    $(".loginBox").hide();
    $(".dashboard").show();
    $("#title").text("Welcome to your Dashboard, " + username);
    channel.push("getAllFollowers", {username: username});
    channel.push("getAllFollowing", {username: username});
  }
});

channel.on("Registered", function(payload){
  username = payload["username"];
  //channel.push("getAllTweets", {username: username});
  console.log(payload);
  if(payload["status"] == true){
    $(".loginBox").hide();
    $(".dashboard").show();
    $("#title").text("Welcome to your Dashboard, " + username);
  }
});


channel.on("ReceiveAllTweets", function(payload){
  var tweetList = document.getElementById("tweetDisplay")
  console.log(payload);
  payload["tweetList"].map((val) => {
      // var tweet = document.createElement("p");
       var tweetText = val[1].split(":")[1];
      // if(val[1].split(" ")[0] === username)
      //   tweet.innerText = "You tweeted: " + tweetText;
      // else
      // tweet.innerText = val[1];
      // tweetList.appendChild(tweet);

      var tweetSpan = document.createElement("span");
      if(tweetText.indexOf("@" + username) > 0){
        var mentionList = document.getElementById("mentionsDisplay");
        
        
        var tweet = document.createElement("p");
        if(val[1].split(" ")[0] === username)
        tweet.innerText = "You tweeted: " + tweetText;
      else
        tweet.innerText = val[1];
    
        var retweetBtn = document.createElement("button");
        retweetBtn.setAttribute("tweetId", val[0]);
        retweetBtn.setAttribute("id", "retweetButton");
        retweetBtn.className="fa fa-retweet";
        retweetBtn.addEventListener("click", function(){
          
          var tweetId = val[0];
          console.log(tweetId);
          channel.push("retweet", {tweetId: tweetId, username: username});
        });
        tweetSpan.appendChild(tweet)
        tweetSpan.appendChild(retweetBtn);
        mentionList.appendChild(tweetSpan);
      }else {
        var tweetList = document.getElementById("tweetDisplay");
        var tweet = document.createElement("p");
    
      if(val[1].split(" ")[0] === username)
        tweet.innerText = "You tweeted: " + tweetText;
      else
        tweet.innerText = val[1];
    
        var retweetBtn = document.createElement("button");
        retweetBtn.setAttribute("tweetId", val[0]);
        retweetBtn.className="fa fa-retweet";
        retweetBtn.addEventListener("click", function(){
          var tweetId = val[0];
          console.log(tweetId);
          channel.push("retweet", {tweetId: tweetId, username: username});
        });
        tweetSpan.appendChild(tweet);
        tweetSpan.appendChild(retweetBtn);
        
        tweetList.appendChild(tweetSpan);
        
      }

  });
});

channel.on("ReceiveTweet", function(payload){
  var tweetText = payload["tweetText"].split(":")[1];
  var tweetSpan = document.createElement("span");
  if(tweetText.indexOf("@" + username) > 0){
    var mentionList = document.getElementById("mentionsDisplay");
    
    var tweet = document.createElement("p");
    if(payload["tweetText"].split(" ")[0] === username)
    tweet.innerText = "You tweeted: " + tweetText;
  else
    tweet.innerText = payload["tweetText"];

    var retweetBtn = document.createElement("button");
    retweetBtn.setAttribute("tweetId", payload["tweetId"]);
    retweetBtn.setAttribute("id", "retweetButton");
    retweetBtn.className="fa fa-retweet";
    retweetBtn.addEventListener("click", function(){
      var tweetId = payload["tweetId"];
      console.log(tweetId);
      channel.push("retweet", {tweetId: tweetId, username: username});
    });
    tweetSpan.appendChild(tweet)
    tweetSpan.appendChild(retweetBtn);
    mentionList.appendChild(tweetSpan);
  }else {
    var tweetList = document.getElementById("tweetDisplay");
    var tweet = document.createElement("p");

  if(payload["tweetText"].split(" ")[0] === username)
    tweet.innerText = "You tweeted: " + tweetText;
  else
    tweet.innerText = payload["tweetText"];

    var retweetBtn = document.createElement("button");
    retweetBtn.setAttribute("tweetId", payload["tweetId"]);
    retweetBtn.setAttribute("id", "retweetButton");
    retweetBtn.className="fa fa-retweet";
    retweetBtn.addEventListener("click", function(){
      var tweetId = payload["tweetId"];
      console.log(tweetId);
      channel.push("retweet", {tweetId: tweetId, username: username});
    });
    tweetSpan.appendChild(tweet)
    tweetSpan.appendChild(retweetBtn);
    tweetList.appendChild(tweetSpan);
  }
});

channel.on("AllFollowers", function(payload){
  var followersDiv = document.getElementById("followersDisplay");
  payload["followersList"].map((val)=>{
    var nameP = document.createElement("p");
    nameP.textContent = val;
    followersDiv.appendChild(nameP);
  });
});

channel.on("AllFollowingUsers", function(payload){
  var followersDiv = document.getElementById("followingDisplay");
  payload["followingList"].map((val)=>{
    var nameP = document.createElement("p");
    nameP.textContent = val;
    followersDiv.appendChild(nameP);
  });
});




channel.on("TweetsByHashtag", function(payload){
  var searchResults = document.getElementById("searchResults");
  console.log(payload);
  while (searchResults.hasChildNodes()) {   
    searchResults.removeChild(searchResults.firstChild);
}
if(payload["tweets"].length == 0) {
  var tweetP = document.createElement("p");
  tweetP.textContent = "No Resuls Found";
  searchResults.appendChild(tweetP);
}else{
  payload["tweets"].map((val)=>{
    var tweetP = document.createElement("p");
    tweetP.textContent = val[1];
    searchResults.appendChild(tweetP);
  });
}
});

channel.on("TweetsByHandle", function(payload){
  var searchResults = document.getElementById("searchResults");
  while (searchResults.hasChildNodes()) {   
    searchResults.removeChild(searchResults.firstChild);
}

console.log(payload);
if(payload["tweets"].length == 0) {
  var tweetP = document.createElement("p");
  tweetP.textContent = "No Results Found";
  searchResults.appendChild(tweetP);
}else{
  payload["tweets"].map((val)=>{
    var tweetP = document.createElement("p");
    tweetP.textContent = val[1];
    searchResults.appendChild(tweetP);
  });
}
});

channel.on("SubscribedUsersTweets", function(payload){
  
});

channel.on("AllFollowingUsers", function(payload){
  
});

channel.on("AddToFollowingList", function(payload){
  var followersDiv = document.getElementById("followingDisplay");
  var userP = document.createElement("p");
  userP.innerText = payload["subscribedUser"];
  followersDiv.appendChild(userP);
});

channel.on("AddToFollowersList", function(payload){
  var followersDiv = document.getElementById("followersDisplay");
  var userP = document.createElement("p");
  userP.innerText = payload["user"];
  followersDiv.appendChild(userP)
});




channel.join()
.receive("ok", resp => { console.log("Joined successfully", resp) })
.receive("error", resp => { console.log("Unable to join", resp) })



export default socket