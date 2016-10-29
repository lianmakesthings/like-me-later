let appId = "123"; //replace
let permissions = "publish_actions"
let postId = "xyz_abc" //userID_postID
let accesstoken = "" //see https://developers.facebook.com/tools/explorer/

chrome.browserAction.onClicked.addListener(function (tab) {
	//currently not called when clicking extension icon - missing permission?
	console.log("TAB", tab)

	//extract user ID from DOM, figure out how to get this from "tab" parameter
	//Array.prototype.slice.call(document.querySelectorAll('#stream_pagelet a')).filter(x=>x.hasAttribute('data-hovercard'))[0].getAttribute('data-hovercard').match(/id=([0-9]*)/)[1]
});

chrome.extension.onConnect.addListener(function(port) {
     console.log("Connected .....");
     port.onMessage.addListener(function(msg) {

     	//Content script interception of token from url, save token and lifetime OR use ChromeExOauth if possible
        window.open("https://www.facebook.com/dialog/oauth?client_id="+appId+"&response_type=token&scope="+permissions+"&redirect_uri=http://www.facebook.com/connect/login_success.html")

        console.log("background message recieved" + msg);
        port.postMessage("Hi Popup.js");

        //do this only when permission has been granted
        var http = new XMLHttpRequest();
		var url = "https://graph.facebook.com/v2.8/"+postId+"/likes?access_token="+accesstoken;
		http.open("POST", url, true);
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		//AJAX callback
		http.onreadystatechange = function() {
		    if(http.readyState == 4 && http.status == 200) {
		    	//success
		        alert(http.responseText);
		    }
		    //handle error state
		}
		//http.send(); //uncomment to send "like" request for postId
     });
})