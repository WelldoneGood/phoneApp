welldonegoodControllers.controller('completedDeedController', ['$scope', '$rootScope', '$state', 'DeedService', 'SwipeToReloadService',
	function($scope, $rootScope, $state, DeedService, SwipeToReloadService) {
		$scope.completedDeeds = [];
		$scope.loadSuccess = true;
		$scope.loadFinished = false;
		$scope.feedLoading = false;
		$scope.currentPageNumber = 1;
		$scope.totalPages = 1;

		$scope.getItemsLoaded = function() {
			return $scope.completedDeeds.length;
		}

		var notificationCallback = function(buttonIndex) {
			//only do something if the refresh was called
			if (buttonIndex === 1) {
				$scope.loadCompletedDeedsData();
			}
		}

		var handler = function() {
	        // a small timeout to demo the loading state
	        SwipeToReloadService.slideUp();
	        $scope.loadCompletedDeedsData();
	    };

	    SwipeToReloadService.init('completedDeedContainer', 'completedDeedPullrefresh', 'completedDeedPullrefresh-icon', 'completedDeedContent', handler);

	    $scope.loadNextPage = function(){
			//We are already loading
			if ($scope.feedLoading) {
				return;
			}

			//if we already have all the pages return
			if ($scope.currentPageNumber >= $scope.totalPages) {
				return;
			}

			$scope.feedLoading = false;
			$scope.currentPageNumber++;
			SwipeToReloadService.slideUp();
			DeedService.getCompletedDeeds($scope.currentPageNumber).then(function(data){
				$scope.loadSuccess = true;

				if (data) {
					$scope.totalPages = data.pages;
					angular.forEach(data.posts, function(post, key){
						$scope.completedDeeds.push(post);
					});		
					$scope.feedLoading = false;		
				} else {
					$scope.feedLoading = false;
					$scope.loadSuccess = false;					
				}
			});
		}

		$scope.loadCompletedDeedsData = function() {
			$scope.loadSuccess = true;
			$scope.feedLoading = true;
			SwipeToReloadService.slideUp();

			DeedService.getCompletedDeeds(1).then(function(data){
				$scope.loadSuccess = true;
				$scope.feedLoading = false;
				$scope.currentPageNumber = 1;

				if (data) {
					$scope.totalPages = data.pages;
					$scope.completedDeeds = data.posts;

					//catch the case where our posts are malformed
					if (!$scope.completedDeeds) {
						$scope.completedDeeds = [];
					}
					$scope.loadFinished = true;
				} else {
					//throw an alert
					if (navigator && navigator.notification) {
						var alertMessage = "There was an error loading your completed deeds.";
						var alertTitle = "Completed Deeds";
						var alertButtons = 'Refresh, Cancel';

						navigator.notification.confirm(alertMessage, notificationCallback, alertTitle, alertButtons);	
					} else {
						alert("Error loading Data");
					}
					
					if ($scope.completedDeeds.length >= 1) {
						//we had a deed feed but can not refresh
						$scope.loadSuccess = false;
					} else {
						//deedFeed failed to load completely
						$scope.loadSuccess = false;
						$scope.completedDeeds = [];	
					}
				}
			});	
		}

		$scope.viewDeedDetails = function(deed) {
			var isDeedInspiration = false;
			angular.forEach(deed.categories, function(category, key){
				if (category.slug == "deedinspirations") {
					isDeedInspiration = true;
					return;
				}
			});

			if (isDeedInspiration) {
				$state.go('capture', { deedId: deed.id});
			} else {
				$state.go('deed', {deedURL: deed.url});
			}
		}

		$scope.getAttachement = function(deed) {
			if (deed.attachments && deed.attachments[0] && deed.attachments[0].url){
				return deed.attachments[0].url;
			} else {
				return false;
			}
		}

		var init = function() {
			$scope.loadCompletedDeedsData();
		}

		init();		
	}
]);