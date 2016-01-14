angular.module("chatAvanticaAdmin", ["ngRoute"])
	.config(function($routeProvider){
		$routeProvider
			.when("/", {
				controller: "loadHome",
				templateUrl: "templates/home.html"
			});
	});