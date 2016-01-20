'use strict';
angular.module("chatAvanticaAdmin")
	.service("userServices", ["$http", "$firebaseAuth", "$cookies", "$base64", "$rootScope", function(h, f, c, b, r){

		this.login = function(userEmail, userPass, callback){
			var refFirebase = new Firebase("https://avantica-chat-test.firebaseio.com");
			var data = f(refFirebase);

			var response;

			data.$authWithPassword({
  				"email": userEmail,
  				"password": userPass
			}).then(function(authData) {

				var cookieEncode = b.encode(userEmail +"-"+ userPass +"-"+ authData.uid);
				r.session = cookieEncode;

				h.defaults.headers.common['Authorization'] = 'Basic ' + cookieEncode;
				c.put("currentSession", r.session);

				response = {success: true};
				callback(response);

			}).catch(function(error) {

				response = {success: false, message: error};
				callback(response);

			});			

		}

		this.getUserInfo = function(){
			r.session = c.get("currentSession") || false;
			var currentSession = b.decode(r.session);
			
			var arrayData = currentSession.split("-");

			return arrayData[0];

		}

		this.clearSession = function(){
			c.remove("currentSession");
			r.session = "";
		}

	}])
	.service("fireServices", ["$firebaseArray", "$firebaseObject", "$rootScope", function(f, o, r){

		this.checkDate = function(){
			console.log("test");
		}

		this.getCurrentChats = function(){
			
			var loadedChats = new Firebase("https://avantica-chat-test.firebaseio.com/chats");
			var usersChat = new Firebase("https://avantica-chat-test.firebaseio.com/users");
			var chatsMessages = new Firebase('https://avantica-chat-test.firebaseio.com/mensages');

			var dataChats = f(loadedChats);
			var dataMessageChats = f(chatsMessages);

			r.currentChats = [];

			dataChats.$watch(function(event) {
				var chatID = event.key;

				var currentChat = loadedChats.child(chatID);
				var dataChat = o(currentChat);

				dataChat.$loaded()
					.then(function(data) {
					
						var today = new Date();
						var currentDate = today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear();

						var chatDate = new Date(data.timestamp);
						var chatCurrentDate = chatDate.getDate() + "-" + chatDate.getMonth() + "-" + chatDate.getFullYear();

						if(currentDate == chatCurrentDate){

							var userCurrentChat = usersChat.child(data.user);
							var dataUserChat = o(userCurrentChat);

							dataUserChat.$loaded()
								.then(function(userData){
									var infoChat = {chat: chatID, username: userData.name, useremail:userData.email, messages: [], newMessage: true}
									
									var chatPreviuosMessages = f(chatsMessages);

									chatPreviuosMessages.$loaded()
										.then(function(data){
											for(var i = 0; i < data.length; i++){
												if(chatID == data[i].chatSession){
													infoChat.messages.push({name: data[i].name, text: data[i].text, sendFrom: data[i].sendFrom});
												}
											}

											r.currentChats.push(infoChat);
										});

								})
								.catch(function(error) {
									console.error("Error:", error);
								});
						}

					})
					.catch(function(error) {
						console.error("Error:", error);
					});

			});

			dataMessageChats.$watch(function(event){
				var messageAddedKey = event.key;

				var messageRef = chatsMessages.child(messageAddedKey);
				var messageData = o(messageRef);

				messageData.$loaded()
					.then(function(data){
						for (var i = 0; i < r.currentChats.length; i++) {
							if(data.chatSession == r.currentChats[i].chat){
								r.currentChats[i].messages.push({name: data.name, text: data.text, sendFrom: data.sendFrom});
							}
						};
					})
					.catch(function(error) {
						console.error("Error:", error);
					});

			});

		}

		this.sendMessage = function(messageObject){
			var chatMessages = new Firebase('https://avantica-chat-test.firebaseio.com/mensages');
			var dataMessage = f(chatMessages);

			dataMessage.$add(messageObject)
				.then(function(ref){
					console.log("Done");
				});

		}

	}]);