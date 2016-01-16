'use strict';
angular.module("chatAvanticaAdmin", ["firebase", "ngRoute", "ngCookies", "base64"])
	.config(function($routeProvider){
		$routeProvider
			.when("/login", {
				controller: "loadHome",
				templateUrl: "templates/home.html"
			})
			.when("/dashboard", {
				controller: "chatDashboard",
				templateUrl: "templates/chatDashboard.html"
			})
			.otherwise({ redirectTo: "/login" });
	})
	.run(function($rootScope, $cookies, $location, $http){

		$rootScope.session = $cookies.get("currentSession") || false;

		if ($rootScope.session) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.session;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            
            var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
            var loggedIn = $rootScope.session;

            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }

        });

	});