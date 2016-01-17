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
			var currentSession = b.decode(r.session);
			
			var arrayData = currentSession.split("-");

			return arrayData[0];

		}

		this.clearSession = function(){
			c.remove("currentSession");
			r.session = "";
		}

	}])
	.service("fireServices", ["$firebaseObject", function(f){

		this.getCurrentChats = function(){
			
			var loadedChats = new Firebase("https://avantica-chat-test.firebaseio.com/chats");
			var dataChats = f(loadedChats);

			console.log(dataChats);

			var chat;
			for(chat in dataChats){
				console.log(chat);
			}

		}

	}]);