welldonegoodControllers.controller('mobilizeController' , ['$scope', '$state', 'DeedService',
	function($scope, $state, DeedService) {
		$scope.deed = {};
		$scope.submitIdea = function() {
			if (!$scope.deed.title || $scope.deed.title == undefined) {
                //throw an alert
                if (navigator && navigator.notification) {
                	var alertMessage = "You must supply a deed name.";
                	var alertTitle = "Deed Name";
                	var alertButtons = ['OK'];

                	navigator.notification.confirm(alertMessage, notificationCallback, alertTitle, alertButtons);   
                } else {
                	alert("You must supply a deed name");
                }
                $scope.posting = false;
                return;
            }

            if (!$scope.deed.content || $scope.deed.content == undefined) {
                //throw an alert
                if (navigator && navigator.notification) {
                	var alertMessage = "You must supply a deed description.";
                	var alertTitle = "Deed Description";
                	var alertButtons = ['OK'];

                	navigator.notification.confirm(alertMessage, notificationCallback, alertTitle, alertButtons);   
                } else {
                	alert("You must supply a deed description.");
                }
                $scope.posting = false;
                return;
            }

            DeedService.postToDeed($scope.deed).then(function(data) {
            	if (data) {
            		$state.go('toDeed');
            	} else {
            		if (navigator && navigator.notification) {
	                	var alertMessage = "There was an issue creating your deed inspiration.  Please try again.";
	                	var alertTitle = "Error";
	                	var alertButtons = ['OK'];

	                	navigator.notification.confirm(alertMessage, notificationCallback, alertTitle, alertButtons);   
	                } else {
	                	alert("There was an error posting your deed inspiration.  Pleast try again.");
	                }
	                $scope.posting = false;
            	}
            });
        }

        var notificationCallback = function(button) {
        	return;
        }
    }]);