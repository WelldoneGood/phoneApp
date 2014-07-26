welldonegoodControllers.controller('captureController' , ['$scope', '$stateParams', '$state', '$modal', 'DeedService', 'PhotoService',
	function($scope, $stateParams, $state, $modal, DeedService, PhotoService) {
		$scope.userDeed = false;
		$scope.posting = false;
		$scope.photo = null;

		DeedService.getAllToDeeds().then(function(data){
			if(data) {
				if (data.posts && data.posts.length > 1) {
					$scope.deedIdeas = data.posts;
				} else {
					$scope.deedIdeas = [];
				}

				$scope.deedIdeas.push({
					id: null,
					title: "Create your own"
				});

				if($stateParams.deedId) {
					angular.forEach($scope.deedIdeas, function(deed, key) {
						if ($stateParams.deedId == deed.id) {
							$scope.deed = $scope.deedIdeas[key];
							return;
						} 
					});

					if (!$scope.deed) {
						$scope.deed = $scope.deedIdeas[0];
					}
				} else {
					$scope.deed = $scope.deedIdeas[$scope.deedIdeas.length - 1];	
				}
				
			} else {
				//throw an alert
				if (navigator && navigator.notification) {
					var alertMessage = "There was an error loading deeds.";
					var alertTitle = "Deed Type";
					var alertButtons = 'Refresh, Cancel';

					navigator.notification.confirm(alertMessage, notificationCallback, alertTitle, alertButtons);	
				} else {
					alert("Error loading Data");
				}
			}
		});

		$scope.captureGoodDeed = function() {
                PhotoService.capturePhotoEdit().then(function(data) {
                    $scope.photo = data;
                });
            };

        $scope.postExistingGoodDeed = function() {
            PhotoService.getPhoto().then(function(data) {
                $scope.photo = data;
            });
        }; 

		$scope.post = function() {
			if ($scope.posting) {
				return;
			}
			
			$scope.posting = true;
			var deedPost = {};
			if ($scope.userDeed) {
				deedPost.title = $scope.userDeedTitle;
			} else {
				deedPost.title = $scope.deed.title.replace("ToDeed:","");
			}

			if (!$scope.userDeedDetails || $scope.userDeedDetails == undefined) {
				deedPost.content = "";
			} else {
				deedPost.content = $scope.userDeedDetails;
			}

			if (!deedPost.title || deedPost.title == undefined) {
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
			
			DeedService.postDeed($scope.photo, deedPost).then(function(result) {
				console.log(result);
				if (result && result.status && result.status !== "error") {
					$scope.posting = false;
					$state.go('share', {deedURL: encodeURIComponent(result.post.url)});
				} else {
					$scope.posting = false;
					//throw an alert
					if (navigator && navigator.notification) {
						var alertMessage = "There was an error posting your completed deeds.";
						var alertTitle = "Post Deed";
						var alertButtons = 'Retry, Cancel';

						navigator.notification.confirm(alertMessage, postNotificationCallback, alertTitle, alertButtons);	
					} else {
						alert("Error loading Data");
					}
				}
			});
		}

		$scope.cancelPost = function() {
			console.log("cancel")
			$state.go('ideas');
		}

		$scope.$watch('deed', function(newValue, oldValue) {
			console.log(newValue);
			if (newValue && !newValue.id) {
				$scope.userDeed = true;
			} else {
				$scope.userDeed = false;
			}
		});

		var postingModal;
        $scope.$watch('posting', function(posting) {
            console.log(posting)
            if (posting) {
                postingModal = $modal.open({
                    templateUrl: "PostingModal.html",
                    windowClass: "loading-modal",
                    backdrop: "static",
                    keyboard: false
                });
            } else {
                if (postingModal) {
                    postingModal.close();
                }
            }
        },true);

		var notificationCallback = function(buttonIndex){
			if (buttonIndex === 1) {
				$scope.loadFeedData();
			}
		}

		var postNotificationCallback = function(buttonIndex){
			if (buttonIndex === 1) {
				$scope.post();
			}
		}
	}]);