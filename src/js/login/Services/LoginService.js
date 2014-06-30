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
