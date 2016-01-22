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
	.service("fireServices", ["$rootScope", "firebaseFactory", function(r, f){

		this.checkDate = function(dateTime){
			var today = new Date();
			var currentDate = today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear();

			var chatDate = new Date(dateTime);
			var chatCurrentDate = chatDate.getDate() + "-" + chatDate.getMonth() + "-" + chatDate.getFullYear();

			return currentDate == chatCurrentDate;
		}

		this.loadPreviousMessages = function(chatID, infoChat){
			var chatPreviuosMessages = f.getMessagesArray();

			chatPreviuosMessages.$loaded()
				.then(function(data){
					for(var i = 0; i < data.length; i++){
						if(chatID == data[i].chatSession){
							infoChat.messages.push({name: data[i].name, text: data[i].text, sendFrom: data[i].sendFrom});
						}
					}

					r.currentChats.push(infoChat);
				});
		}

		this.getCurrentChats = function(dateValid, loadMessages){

			var dataChats = f.getChatArray();

			r.currentChats = [];

			dataChats.$watch(function(event) {
				var chatID = event.key;

				var dataChat = f.getChatObject(null, chatID);

				dataChat.$loaded()
					.then(function(data) {
					
						var dateChecked = dateValid(data.timestamp);

						if(dateChecked){

							var dataUserChat = f.getUsersObject(null, data.user);

							dataUserChat.$loaded()
								.then(function(userData){
									var infoChat = {chat: chatID, username: userData.name, useremail:userData.email, messages: [], newMessage: true}
									
									loadMessages(chatID, infoChat);

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

			this.checkIncomingMessages(this.attchNewMessage);

		}

		this.checkIncomingMessages = function(callback){
			var dataMessageChats = f.getMessagesArray();

			dataMessageChats.$watch(function(event){
				var messageAddedKey = event.key;

				var messageData = f.getMessagesObject(null, messageAddedKey);

				messageData.$loaded()
					.then(function(data){
						callback(data);
					})
					.catch(function(error) {
						console.error("Error:", error);
					});

			});
		}

		this.attchNewMessage = function(data){
			for (var i = 0; i < r.currentChats.length; i++) {
				if(data.chatSession == r.currentChats[i].chat){
					r.currentChats[i].messages.push({name: data.name, text: data.text, sendFrom: data.sendFrom});

					if("user" == data.sendFrom && r.currentChat != data.chatSession){
						r.currentChats[i].newMessage = true;
					}
					
				}
			};
		}

		this.sendMessage = function(messageObject){
			var dataMessage = f.getMessagesArray();

			dataMessage.$add(messageObject)
				.then(function(ref){
					console.log("Done");
				});

		}

	}]);