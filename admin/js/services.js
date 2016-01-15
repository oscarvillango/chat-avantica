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
				r.session = JSON.stringify({"userInfo" : { "user": userEmail, "keyValue": cookieEncode }});

				h.defaults.headers.common['Authorization'] = 'Basic ' + cookieEncode;
				c.put("currentSession", r.session);

				response = {success: true};
				callback(response);

			}).catch(function(error) {

				response = {success: false, message: error};
				callback(response);

			});			

		}

		this.clearSession = function(){
			c.remove("currentSession");
			r.session
		}

	}]);