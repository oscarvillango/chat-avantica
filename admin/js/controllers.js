'use strict';
angular.module("chatAvanticaAdmin")
	.controller("loadHome",["$scope", "$location", "userServices", function(s, l, u){

		s.loginChat = function(){

			u.login(s.login.email, s.login.password, function(response){
				if(response.success){
					l.path("/dashboard");
				}else{
					console.log(response.message);
				}
			});

		}

	}])
	.controller("chatDashboard", ["$scope", "userServices", "fireServices", function(s, u, f){
		s.newMessage = {};

		f.getCurrentChats();

		s.seeChat = function(currentChat){
			s.currentChat = currentChat.chat;
			s.newMessage = {chatID : currentChat.chat, message: ""};
		}

		s.addMessage = function(){
			var userLogged = u.getUserInfo();

			var messageObject = {
				name: userLogged,
				text: s.newMessage.message,
				chatSession: s.newMessage.chatID
			};

			f.sendMessage(messageObject);
			
			s.newMessage = {chatID : s.newMessage.chatID, message: ""};
		}

	}])