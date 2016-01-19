jQuery(document).ready(function(){
	var chatUsers = new Firebase('https://avantica-chat-test.firebaseio.com/users');
	var chatChats = new Firebase('https://avantica-chat-test.firebaseio.com/chats');
	var chatMessages = new Firebase('https://avantica-chat-test.firebaseio.com/mensages');

	var btnSession = jQuery("#btnSession");

	btnSession.on("click", createSession);

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
					chatMessages.push({name:username, text:message, chatSession: chat});
				}
				
				chatMessage.val('');
			}
		});

		chatMessages.limitToLast(10).on('child_added', function (snapshot) {

			var data = snapshot.val();

			if(chatRef == data.chatSession){
				var username = data.name;
				var message = data.text;

				var output = '<div class="message"><strong class="example-chat-username">'
					+ username +': </strong>'+ message +'</div>';

				jQuery(".chatMessages").append(output);

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

});