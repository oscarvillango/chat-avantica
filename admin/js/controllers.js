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
	.controller("chatDashboard", ["$scope", function(s){

	}])