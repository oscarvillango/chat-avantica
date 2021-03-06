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
	.controller("chatDashboard", ["$rootScope", "$scope", "userServices", "fireServices", "$location", function(r, s, u, f, l){
		s.newMessage = {};

		f.getCurrentChats(f.checkDate, f.loadPreviousMessages);

		s.username = u.getUserInfo();

		f.autoScrollChats();

		s.seeChat = function(currentChat){
			r.currentChat = currentChat.chat;
			currentChat.newMessage = false;
			s.newMessage = {chatID : currentChat.chat, message: ""};
			f.autoScrollChats();
		}

		s.addMessage = function(){
			var userLogged = u.getUserInfo();

			var messageObject = {
				name: userLogged,
				text: s.newMessage.message,
				chatSession: s.newMessage.chatID,
				sendFrom: "admin"
			};

			f.sendMessage(messageObject);
			
			s.newMessage = {chatID : s.newMessage.chatID, message: ""};
		}

		s.logoutSession = function(){
			u.clearSession();
			l.path("/login");
		}

	}])