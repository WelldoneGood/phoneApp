angular.module('virtuosumLogin', ['ui.bootstrap', 'virtuosumLoginControllers', 'virtuosumLoginServices']);

var virtuosumLoginControllers = angular.module('virtuosumLoginControllers', []);
var virtuosumLoginServices = angular.module('virtuosumLoginServices', []);
var virtuosumLoginEndpoints = {
    login: 'http://welldonegood.com/wp-login.php?loggedout=true',
    termsOfService: 'http://www.welldonegood.com/terms-of-service/',
    // login: 'http://ec2-54-186-243-218.us-west-2.compute.amazonaws.com/virt-wp/wp-login.php?loggedout=true',
    mainAppLocation: 'welldonegood.html'
}
;
virtuosumLoginControllers.controller('loginController', ['$scope', '$rootScope', '$window', 'LoginService',
	function($scope, $rootScope, $window, LoginService) {
		$scope.loginReady = false;
        $scope.isios = false;

		$rootScope.$on('deviceready', function() {
            if (device.platform === 'iOS' && parseFloat(device.version) >= 7.0) {
                $scope.isios = true;
            }
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
]);;
virtuosumLoginServices.service('LoginService', ['$http', '$q',
	function($http, $q) {
		var LoginService = {};
        LoginService.LoginType = {};
        LoginService.LoginType.facebook = 1;
        LoginService.LoginType.google = 2;

    	LoginService.verifyLogin = function() {
            var loginInformation = false;
            var token = openFB.getCredentials();

            if (token) {
                loginInformation = {
                    type: LoginService.LoginType.facebook,
                    token: token
                };
            } 

            return loginInformation;
        };

        LoginService.getVirtuosumCookie = function(type, token) {
    		switch(type) {
                case LoginService.LoginType.facebook:
                    return LoginService.getVirtuosumCookieFaceBook(token);
                break;
                case LoginService.LoginType.google:
                break;
                default:
                    if (navigator && navigator.notification) {
                        var alertMessage = "Please select one of the login options.  Please Try again.";
                        var alertTitle = "Unknow Login";
                        var alertButtons = 'OK';
                        navigator.notification.confirm(alertMessage, notificationCallback, alertTitle, alertButtons);   
                    } else {
                        alert("Error during login");
                    }
                break;
            }
    	};

        LoginService.getVirtuosumCookieFaceBook = function(token) {
            var virtuosumLoginDeferred = $q.defer();
            var loginData = 'fball_redirect=&action=fball&fball_access_token=' + token;

            var config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };

            $http.post(virtuosumLoginEndpoints.login, loginData, config)
                .success(function(data, status, header) {
                    virtuosumLoginDeferred.resolve(true);
                    
                })
                .error(function(data) {
                    virtuosumLoginDeferred.resolve(false);
                });

            return virtuosumLoginDeferred.promise;
        };

    	return LoginService;
	}
]);
