angular.module("chatAvanticaAdmin")
	.controller("loadHome",["$scope", "$firebaseAuth", function(s, f){

		s.loginChat = function(){

			var refFirebase = new Firebase("https://avantica-chat-test.firebaseio.com");
			var data = f(refFirebase);

			data.$authWithPassword({
  				"email": s.login.email,
  				"password": s.login.password
			}).then(function(authData) {
				console.log("Logged in as:", authData.uid);
			}).catch(function(error) {
				console.log(error);
			});
		}

	}])