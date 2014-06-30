virtuosumLoginControllers.controller('loginController', ['$scope', '$rootScope', '$window', 'LoginService',
	function($scope, $rootScope, $window, LoginService) {
		$scope.loginReady = false;

		$rootScope.$on('deviceready', function() {
			$scope.completeFacebookLogin();
        }, false);

        $scope.viewTermsOfService = function() {
            if (device.platform == "Android") {
                window.open(virtuosumLoginEndpoints.termsOfService, '_blank', 'location=yes,closebuttoncaption=Done');
            } else {
                window.open(virtuosumLoginEndpoints.termsOfService, '_blank', 'location=no,closebuttoncaption=Done');    
            }
        }

        $scope.loginWithFacebook = function() {
        	openFB.login('email', $scope.completeFacebookLogin,$scope.loginError);
        }

        $scope.completeFacebookLogin = function() {
        	var loginInformation = LoginService.verifyLogin();
        	if (loginInformation.token) {

	      		LoginService.getVirtuosumCookie(loginInformation.type, loginInformation.token)
	      		.then(function(result){
	      			if (result) {
	      				$window.location = virtuosumLoginEndpoints.mainAppLocation;
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