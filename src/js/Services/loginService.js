welldonegoodControllers.service('loginService', ['$http', '$q',
	function($http, $q) {
		var loginService = {};
        loginService.LoginType = {};
        loginService.LoginType.facebook = 1;
        loginService.LoginType.google = 2;

    	loginService.verifyLogin = function() {
            var loginInformation = false;
            var token = openFB.getCredentials();

            if (token) {
                loginInformation = {
                    type: loginService.LoginType.facebook,
                    token: token
                };
            } 

            return loginInformation;
        };

        loginService.getWellDoneGoodCookie = function(loginInformation) {
    		switch(loginInformation.type) {
                case loginService.LoginType.facebook:
                    return loginService.getWellDoneGoodCookieFaceBook(loginInformation.token);
                break;
                case loginService.LoginType.google:
                    alert("Not Implemented Yet");
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

        loginService.getWellDoneGoodCookieFaceBook = function(token) {
            var welldonegoodLoginDeferred = $q.defer();
            var loginData = 'fball_redirect=&action=fball&fball_access_token=' + token;

            var config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };

            $http.post(welldonegoodEndpoints.login, loginData, config)
                .success(function(data, status, header) {
                    welldonegoodLoginDeferred.resolve(true);
                    
                })
                .error(function(data) {
                    welldonegoodLoginDeferred.resolve(false);
                });

            return welldonegoodLoginDeferred.promise;
        };

    	return loginService;
	}
]);
