welldonegoodControllers.controller('mainPageController' , ['$scope', '$rootScope', '$state', 'loginService',
	function($scope, $rootScope,$state, loginService) {
		$scope.showMenu = false;
        $scope.loginComplete = false;
        $scope.isios = false;

        //The line below stores the Facebook token in localStorage instead of sessionStorage
        openFB.init(welldonegoodEndpoints.facebookAppID, 'https://www.facebook.com/connect/login_success.html', window.localStorage);

        $rootScope.$on('loginComplete', function() {
            $scope.loginComplete = true;
        });

        $rootScope.$on('deviceready', function() {
            if (device.platform === 'iOS' && parseFloat(device.version) >= 7.0) {
                $scope.isios = true;
            }
            var loginInformation = loginService.verifyLogin();
            if (loginInformation) {
                loginService.getWellDoneGoodCookie(loginInformation).then(function(result){
                    if (result) {
                        $scope.loginComplete = true;
                        $state.go('deedFeed');
                    } else {
                        $state.go('login');
                    }
                });
            } else {
                console.log("Going to login");
                $state.go('login');
            }
        }, false);

		$rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){
               $scope.showMenu = false;

                if(toState.name == "deed") {
                    if (device.platform == "Android") {
                        window.open(toParams.deedURL, '_blank', 'location=yes,closebuttoncaption=Done');
                    } else {
                        window.open(toParams.deedURL, '_blank', 'location=no,closebuttoncaption=Done');    
                    }
                    event.preventDefault();
                }

                if(toState.name == "privacy") {
                    if (device.platform == "Android") {
                        window.open(welldonegoodEndpoints.privacyPolicy, '_blank', 'location=yes,closebuttoncaption=Done');
                    } else {
                        window.open(welldonegoodEndpoints.privacyPolicy, '_blank', 'location=no,closebuttoncaption=Done');    
                    }
                    event.preventDefault();
                }

                if(toState.name == "terms") {
                    if (device.platform == "Android") {
                        window.open(welldonegoodEndpoints.termsOfService, '_blank', 'location=yes,closebuttoncaption=Done');
                    } else {
                        window.open(welldonegoodEndpoints.termsOfService, '_blank', 'location=no,closebuttoncaption=Done');    
                    }
                    event.preventDefault();
                }
            });

		$scope.toggleMenu = function() {
			$scope.showMenu = !$scope.showMenu;
		}
	}
]);