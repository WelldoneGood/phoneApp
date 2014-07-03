welldonegoodControllers.controller('shareController' , ['$scope', '$stateParams', '$state',
	function($scope, $stateParams, $state) {
		$scope.noshare = function() {
			$state.go('deedFeed');
		}

		console.log($stateParams.deedURL);

		$scope.facebookShare = function() {
			openFB.init('609372205806860', 'https://www.facebook.com/connect/login_success.html', window.localStorage);

			openFB.api(
			{
				method: 'POST',
				path: '/me/feed',
				params: {
					link: decodeURIComponent($stateParams.deedURL),
					message: 'Check out my good deed!'
				},
				success: postSuccessHandler,
				error: postErrorHandler
			});
			console.log($stateParams.deedURL);
		}

		var postSuccessHandler = function() {
			$state.go('deedFeed');
		}

		var postErrorHandler = function() {
			if (navigator && navigator.notification) {
				var alertMessage = "There was an error posting.  Please try again.";
				var alertTitle = "Error Posting";
				var alertButtons = ['OK'];

				navigator.notification.confirm(alertMessage, postFailNotificationHandler, alertTitle, alertButtons);	
			} else {
				alert("Error posting Data");
			}
		}

		var postFailNotificationHandler = function() {
			//do nothing!
		}
	}]);