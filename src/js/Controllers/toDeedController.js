welldonegoodControllers.controller('toDeedController', ['$scope', '$rootScope', '$state', 'DeedService', 'SwipeToReloadService',
	function($scope, $rootScope, $state, DeedService, SwipeToReloadService) {
		$scope.deedIdeas = [];
		$scope.feedSuccess = true;
		$scope.feedLoading = false;
		$scope.currentPageNumber = 1;
		$scope.totalPages = 1;

		$scope.getItemsLoaded = function() {
			return $scope.deedIdeas.length;
		}

		var notificationCallback = function(buttonIndex) {
			//only do something if the refresh was called
			if (buttonIndex === 1) {
				$scope.loadIdeaData();
			}
		}

		var handler = function() {
			SwipeToReloadService.slideUp();
	        $scope.loadIdeaData();
	    };

	    SwipeToReloadService.init('deedIdeasContainer', 'deedIdeasPullrefresh', 'deedIdeasPullrefresh-icon', 'deedIdeasContent', handler);

	    $scope.loadNextPage = function(){
			//We are already loading
			if ($scope.feedLoading) {
				return;
			}

			//if we already have all the pages return
			if ($scope.currentPageNumber >= $scope.totalPages) {
				return;
			}

			$scope.feedLoading = true;
			SwipeToReloadService.slideUp();
			$scope.currentPageNumber++;
			DeedService.getToDeeds($scope.currentPageNumber).then(function(data){
				$scope.feedSuccess = true;

				if (data) {
					$scope.totalPages = data.pages;
					angular.forEach(data.posts, function(post, key){
						$scope.deedIdeas.push(post);
					});		
					$scope.feedLoading = false;			
				} else {
					$scope.feedLoading = false;
					$scope.feedSuccess = false;					
				}
			});
		}

		$scope.loadIdeaData = function() {
			$scope.feedLoading = true;
			$scope.feedSuccess = true;
			SwipeToReloadService.slideUp();

			DeedService.getToDeeds(1).then(function(data){
				//always reset the page number onload
				$scope.currentPageNumber = 1;
				$scope.feedLoading = false;
				$scope.feedSuccess = true;

				if (data) {
					$scope.totalPages = data.pages;
					$scope.deedIdeas = data.posts;
				} else {
					//throw an alert
					if (navigator && navigator.notification) {
						var alertMessage = "There was an error loading deed Ideas";
						var alertTitle = "Deed Ideas";
						var alertButtons = 'Refresh, Cancel';

						navigator.notification.confirm(alertMessage, notificationCallback, alertTitle, alertButtons);	
					} else {
						alert("Error loading Data");
					}
					
					if ($scope.deedIdeas.length >= 1) {
						//we had a deed feed but can not refresh
						$scope.feedSuccess = false;
					} else {
						//deedIdeas failed to load completely
						$scope.feedSuccess = false;
						$scope.deedIdeas = [];	
					}
				}
			});	
		}

		var init = function() {
			$scope.loadIdeaData();
		}

		init();		
	}
]);