jQuery(document).ready(function () {
	var chatUsers = new Firebase('https://avantica-chat-test.firebaseio.com/users'),
        chatChats = new Firebase('https://avantica-chat-test.firebaseio.com/chats'),
        chatMessages = new Firebase('https://avantica-chat-test.firebaseio.com/mensages');

	var btnSession = jQuery("#btnSession");
	var startChat = jQuery("#startChat");

	startChat.submit(function(e){
		e.preventDefault();
		createSession();
	});

	function createSession(){
		var nameSession = jQuery("#sessionName");
		var emailSession = jQuery("#sessionEmail");

		var response = chatUsers.push({name: nameSession.val(), email: emailSession.val()});

		createChat(response.path.w[1]);
	}

	function createChat(userRef){
		var d = new Date();

		chatResponse = chatChats.push({user: userRef, timestamp: d.getTime()});

		initChat(chatResponse.path.w[1]);
	}


	function initChat(chatRef){
		jQuery(".setSession").fadeOut("slow", function(){
			jQuery(".avChatBody").removeClass("login");
			jQuery(".chatLive").fadeIn("slow");
			setClock();
			scrollChat();
		});

		var userID = getChatUser(chatRef);
		var currentUser = getUserName(userID);

		jQuery("#greetings").html("Hi " + currentUser + "!!");

		var chatMessage = jQuery("#chatMessage");

		chatMessage.keypress(function (e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				var username = currentUser;
				var message = chatMessage.val();
				var chat = chatRef;

				if ("" != message) {
					chatMessages.push({name:username, text:message, chatSession: chat, sendFrom: "user"});
				}
				
				chatMessage.val('');
			}
		});

		chatMessages.limitToLast(10).on('child_added', function (snapshot) {

			var data = snapshot.val();

			if(chatRef == data.chatSession){
				var username = data.name;
				var message = data.text;
				var sendFrom = data.sendFrom;

				var classExtra = "";

				if("admin" == sendFrom){
					classExtra = "adminMessage";
				}else{
					classExtra = "userMessage";
				}

				var output = '<div class="message '+ classExtra +'"><strong class="example-chat-username">'
					+ username +': </strong><div class="messageText">'+ message +'</div></div>';

				jQuery(".chatMessages .chatList").append(output);
				jQuery(".chatMessages").each(function(){
					jQuery(this).animate({scrollTop: jQuery(this).children(".chatList").outerHeight()});
				});	

			}

		});

	}

	function getChatUser(chatRef){

		var chatCurrentRef = chatChats.child(chatRef);
		var userRefChat = "";

		chatCurrentRef.on("value", function(snapshot) {
			var data = snapshot.val();
			userRefChat = data.user;
		}, function (errorObject) {
			userRefChat = false;
		});

		return userRefChat;
	}

	function getUserName(userRef){

		var userCurrentRef = chatUsers.child(userRef);
		var userNameChat = "";

		userCurrentRef.on("value", function(snapshot) {
			var data = snapshot.val();
			userNameChat = data.name;
		}, function (errorObject) {
			userNameChat = false;
		});

		return userNameChat;
	}

	function setClock(){
		var today = new Date();

		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();

		m = checkTime(m);
		s = checkTime(s);
		document.getElementById('status').innerHTML = h + ":" + m + ":" + s;

		var t = setTimeout(setClock, 500);
	}

	function checkTime(i) {
		if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
		return i;
	}

	function scrollChat(){
		/*setInterval(function(){
			jQuery(".chatMessages").each(function(){
				jQuery(this).animate({scrollTop: jQuery(this).children(".chatList").outerHeight()});
			});				
		}, 200);*/
	}

});