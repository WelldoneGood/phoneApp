welldonegoodControllers.controller('deedFeedController', ['$scope', '$state', 'DeedService', 'SwipeToReloadService',
	function($scope, $state, DeedService, SwipeToReloadService) {
		$scope.deedFeed = [];
		$scope.feedSuccess = true;
		$scope.feedLoading = false;
		$scope.currentPageNumber = 1;
		$scope.totalPages = 1;

		var notificationCallback = function(buttonIndex) {
			//only do something if the refresh was called
			if (buttonIndex === 1) {
				$scope.loadFeedData();
			}
		}

		$scope.loadNextPage = function(){
			//We are already loading
			if ($scope.feedLoading) {
				return;
			}

			//if we already have all the pages return
			if ($scope.currentPageNumber >= $scope.totalPages) {
				return;
			}

			$scope.currentPageNumber++;
			DeedService.getDeedFeed($scope.currentPageNumber).then(function(data){
				$scope.feedSuccess = true;

				SwipeToReloadService.slideUp();
				if (data) {
					$scope.totalPages = data.pages;
					angular.forEach(data.posts, function(post, key){
						$scope.deedFeed.push(post);
					});		
					$scope.feedLoading = false;			
				} else {
					$scope.feedLoading = false;
					$scope.feedSuccess = false;					
				}
			});
		}

		var handler = function() {
	        // a small timeout to demo the loading state
	        setTimeout(function() {
	            $scope.loadFeedData();
	        }, 1000);
	    };

	    SwipeToReloadService.init('deedFeedContainer', 'deedFeedPullrefresh', 'deedFeedPullrefresh-icon', 'deedFeedContent', handler);

		$scope.loadFeedData = function() {
			$scope.feedLoading = true;
			$scope.feedSuccess = true;

			//hard code pulling page number 1
			DeedService.getDeedFeed(1).then(function(data){
				//always reset the page number onload
				$scope.currentPageNumber = 1;
				$scope.feedLoading = false;
				$scope.feedSuccess = true;

				SwipeToReloadService.slideUp();
				if (data) {
					$scope.totalPages = data.pages;
					$scope.deedFeed = data.posts;
				} else {
					//throw an alert
					if (navigator && navigator.notification) {
						var alertMessage = "There was an error loading the Deed Feed";
						var alertTitle = "Deed Feed";
						var alertButtons = 'Refresh, Cancel';

						navigator.notification.confirm(alertMessage, notificationCallback, alertTitle, alertButtons);	
					} else {
						alert("Error loading Data");
					}
					
					if ($scope.deedFeed.length >= 1) {
						//we had a deed feed but can not refresh
						$scope.feedSuccess = false;
					} else {
						//deedFeed failed to load completely
						$scope.feedSuccess = false;
						$scope.deedFeed = [];	
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

		var init = function() {
			$scope.loadFeedData();
		}

		$scope.getItemsLoaded = function() {
			return $scope.deedFeed.length;
		}

		$scope.getAttachement = function(deed) {
			if (deed.attachments && deed.attachments[0] && deed.attachments[0].url){
				return deed.attachments[0].url;
			} else {
				return false;
			}
		}

		init();		
	}
]);