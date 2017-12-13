// // Brunch automatically concatenates all files in your
// // watched paths. Those paths can be configured at
// // config.paths.watched in "brunch-config.js".
// //
// // However, those files will only be executed if
// // explicitly imported. The only exception are files
// // in vendor, which are never wrapped in imports and
// // therefore are always executed.

// // Import dependencies
// //
// // If you no longer want to use a dependency, remember
// // to also remove its path from "config.paths.watched".
 import "phoenix_html"

// // Import local files
// //
// // Local files can be imported directly using relative
// // paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"
// $( document ).ready(function() {
//     // DOM ready

//     // Test data
//     /*
//      * To test the script you should discomment the function
//      * testLocalStorageData and refresh the page. The function
//      * will load some test data and the loadProfile
//      * will do the changes in the UI
//      */
//     // testLocalStorageData();
//     // Load profile if it exits
//     loadProfile();
// });

// /**
//  * Function that gets the data of the profile in case
//  * thar it has already saved in localstorage. Only the
//  * UI will be update in case that all data is available
//  *
//  * A not existing key in localstorage return null
//  *
//  */
// function getLocalProfile(callback){
//     var profileImgSrc      = localStorage.getItem("PROFILE_IMG_SRC");
//     var profileName        = localStorage.getItem("PROFILE_NAME");
//     var profileReAuthEmail = localStorage.getItem("PROFILE_REAUTH_EMAIL");

//     if(profileName !== null
//             && profileReAuthEmail !== null
//             && profileImgSrc !== null) {
//         callback(profileImgSrc, profileName, profileReAuthEmail);
//     }
// }

// /**
//  * Main function that load the profile if exists
//  * in localstorage
//  */
// function loadProfile() {
//     if(!supportsHTML5Storage()) { return false; }
//     // we have to provide to the callback the basic
//     // information to set the profile
//     getLocalProfile(function(profileImgSrc, profileName, profileReAuthEmail) {
//         //changes in the UI
//         $("#profile-img").attr("src",profileImgSrc);
//         $("#profile-name").html(profileName);
//         $("#reauth-email").html(profileReAuthEmail);
//         $("#inputEmail").hide();
//         $("#remember").hide();
//     });
// }

// /**
//  * function that checks if the browser supports HTML5
//  * local storage
//  *
//  * @returns {boolean}
//  */
// function supportsHTML5Storage() {
//     try {
//         return 'localStorage' in window && window['localStorage'] !== null;
//     } catch (e) {
//         return false;
//     }
// }

// /**
//  * Test data. This data will be safe by the web app
//  * in the first successful login of a auth user.
//  * To Test the scripts, delete the localstorage data
//  * and comment this call.
//  *
//  * @returns {boolean}
//  */
// function testLocalStorageData() {
//     if(!supportsHTML5Storage()) { return false; }
//     localStorage.setItem("PROFILE_IMG_SRC", "//lh3.googleusercontent.com/-6V8xOA6M7BA/AAAAAAAAAAI/AAAAAAAAAAA/rzlHcD0KYwo/photo.jpg?sz=120" );
//     localStorage.setItem("PROFILE_NAME", "César Izquierdo Tello");
//     localStorage.setItem("PROFILE_REAUTH_EMAIL", "oneaccount@gmail.com");
// }