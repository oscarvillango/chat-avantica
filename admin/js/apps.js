angular.module("chatAvanticaAdmin", ["firebase", "ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.when("/", {
				controller: "loadHome",
				templateUrl: "templates/home.html"
			});
	});