welldonegoodControllers.controller('mainPageController' , ['$scope', '$rootScope', '$state',
	function($scope, $rootScope,$state) {
		$scope.showMenu = false;

		$rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){
               $scope.showMenu = false;

                if(toState.name == "deed") {
                    console.log(toParams);
                    if (device.platform == "Android") {
                        window.open(toParams.deedURL, '_blank', 'location=yes,closebuttoncaption=Done');
                    } else {
                        window.open(toParams.deedURL, '_blank', 'location=no,closebuttoncaption=Done');    
                    }
                    event.preventDefault();
                }
            });

		$scope.toggleMenu = function() {
			$scope.showMenu = !$scope.showMenu;
		}
	}
]);