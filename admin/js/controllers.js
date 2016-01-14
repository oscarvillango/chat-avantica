angular.module("chatAvanticaAdmin")
	.controller("loadHome",["$scope", function(s){
		
		s.loginChat = function(){
			console.log(s.login);
		}

	}])