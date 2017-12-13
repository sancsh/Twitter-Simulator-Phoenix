import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}});

socket.connect();

let channel = socket.channel("twitter", {});

// $('#loginButton').click(function(){
    channel.push('register_account', {username: "huz1", password: "sis"});
// })

channel.on('Registered', payload => {
    console.log(payload);
  });

channel.join()
.receive("ok", resp => { console.log("Joined successfully", resp) })
.receive("error", resp => { console.log("Unable to join", resp) })

export default socket