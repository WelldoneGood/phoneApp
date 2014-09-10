welldonegoodControllers.controller('loginController', ['$scope', '$rootScope', '$window', '$state', 'loginService',
	function($scope, $rootScope, $window, $state, loginService) {
		$scope.loginReady = true;
        console.log("Going to login - HERE");

        $scope.viewTermsOfService = function() {
            if (device.platform == "Android") {
                window.open(welldonegoodEndpoints.termsOfService, '_blank', 'location=yes,closebuttoncaption=Done');
            } else {
                window.open(welldonegoodEndpoints.termsOfService, '_blank', 'location=no,closebuttoncaption=Done');    
            }
        }

        $scope.loginWithFacebook = function() {
            $scope.loginReady = false;
        	openFB.login('email', $scope.completeFacebookLogin,$scope.loginError);
        }

        $scope.completeFacebookLogin = function() {
            //Check to see if the facebook login worked
        	var loginInformation = loginService.verifyLogin();
        	if (loginInformation.token) {
                //get the welldonegood cookie based on the loginInformation from the service
	      		loginService.getWellDoneGoodCookie(loginInformation)
	      		.then(function(result){
	      			if (result) {
                        $rootScope.$broadcast('loginComplete');
	      				$state.go('deedFeed');
	      			} else {
	      				$scope.loginError();
	      			}
	            });
	        } else {
            	$scope.loginReady = true;
            }
        }

        $scope.loginError = function() {
        	$scope.loginReady = true;

        	if (navigator && navigator.notification) {
        		var alertMessage = "There was an error during Login.  Please Try again.";
        		var alertTitle = "Login Error";
        		var alertButtons = 'OK';

        		navigator.notification.confirm(alertMessage, notificationCallback, alertTitle, alertButtons);	
        	} else {
        		alert("Error during login");
        	}
        }
	}
]);