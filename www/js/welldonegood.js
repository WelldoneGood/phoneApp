var welldonegoodApp = angular.module('welldonegood', ['ui.bootstrap', 'ui.router', 'welldonegoodControllers', 'welldonegoodServices'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/deedFeed");

        $stateProvider.state('toDeed', {
            url: "/toDeed",
            templateUrl: "partials/toDeed.html",
            controller: 'toDeedController'
        });

        $stateProvider.state('completed', {
            url: "/completed",
            templateUrl: "partials/completed.html",
            controller: 'completedDeedController'
        });

        $stateProvider.state('capture', {
            url: "/capture/:deedId",
            templateUrl: "partials/capture.html",
            controller: 'captureController'
        });

        $stateProvider.state('share', {
            url: "/share/:deedURL",
            templateUrl: "partials/share.html",
            controller: 'shareController'
        });

        $stateProvider.state('mobilize', {
            url: "/mobilize",
            templateUrl: "partials/mobilize.html",
            controller: 'mobilizeController'
        });

        $stateProvider.state('deedFeed', {
            url: '/deedFeed',
            templateUrl: "partials/deedFeed.html",
            controller: 'deedFeedController'
        });

        $stateProvider.state('deed', {
            url: '/deed/:deedURL'
        });
    });

var welldonegoodControllers = angular.module('welldonegoodControllers', []);
var welldonegoodServices = angular.module('welldonegoodServices', []);
var welldonegoodEndpoints = {
    // deedFeedLocation: 'http://www.welldonegood.com/?json=get_recent_posts',
    // completedDeedLocation: 'http://www.welldonegood.com/?json=get_author_posts',
    // deedIdeaLocation: 'http://www.welldonegood.com/?json=get_category_posts&slug=deedinspirations',
    // nonceLocation: 'http://www.welldonegood.com/?json=get_nonce&controller=posts&method=create_post&callback=?',
    // createPost: 'http://www.welldonegood.com/?json=create_post',
    // userInformation: 'http://www.welldonegood.com/?json=currentuser/get_currentuserinfo'
    deedFeedLocation: 'http://ec2-54-186-243-218.us-west-2.compute.amazonaws.com/virt-wp/?json=get_recent_posts',
    completedDeedLocation: 'http://ec2-54-186-243-218.us-west-2.compute.amazonaws.com/virt-wp/?json=get_author_posts',
    deedIdeaLocation: 'http://ec2-54-186-243-218.us-west-2.compute.amazonaws.com/virt-wp/?json=get_category_posts&slug=deedinspirations',
    nonceLocation: 'http://ec2-54-186-243-218.us-west-2.compute.amazonaws.com/virt-wp/?json=get_nonce&controller=posts&method=create_post&callback=?',
    createPost: 'http://ec2-54-186-243-218.us-west-2.compute.amazonaws.com/virt-wp/?json=create_post',
    userInformation: 'http://ec2-54-186-243-218.us-west-2.compute.amazonaws.com/virt-wp/?json=currentuser/get_currentuserinfo'
}
;
welldonegoodControllers.controller('captureController' , ['$scope', '$stateParams', '$state', 'DeedService', 'PhotoService',
	function($scope, $stateParams, $state, DeedService, PhotoService) {
		$scope.userDeed = false;
		$scope.posting = false;
		$scope.photo = null;

		DeedService.getAllToDeeds().then(function(data){
			if(data) {
				$scope.deedIdeas = data.posts;
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
				if (result) {
					$scope.posting = false;
					$state.go('share', {deedURL: encodeURIComponent(result.post.url)});
				} else {
					$scope.posting = false;
					//throw an alert
					if (navigator && navigator.notification) {
						var alertMessage = "There was an error posting your completed deeds.";
						var alertTitle = "Post Deed";
						var alertButtons = 'Retry, Cancel';

						navigator.notification.confirm(alertMessage, $scope.post, alertTitle, alertButtons);	
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

		var notificationCallback = function(buttonIndex){
			if (buttonIndex === 1) {
				$scope.loadFeedData();
			}
		}
	}]);;
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
	        setTimeout(function() {
	            $scope.loadCompletedDeedsData();
	        }, 1000);
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

			$scope.currentPageNumber++;
			DeedService.getCompletedDeeds($scope.currentPageNumber).then(function(data){
				$scope.loadSuccess = true;

				SwipeToReloadService.slideUp();
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

			DeedService.getCompletedDeeds(1).then(function(data){
				$scope.loadSuccess = true;
				$scope.feedLoading = false;
				$scope.currentPageNumber = 1;
				SwipeToReloadService.slideUp();

				if (data) {
					$scope.totalPages = data.pages;
					$scope.completedDeeds = data.posts;
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
]);;
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
]);;
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
]);;
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
    }]);;
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
	}]);;
welldonegoodControllers.controller('toDeedController', ['$scope', '$rootScope', '$state', 'DeedService', 'SwipeToReloadService',
	function($scope, $rootScope, $state, DeedService, SwipeToReloadService) {
		$scope.deedIdeas = [];
		$scope.feedSuccess = true;
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
	        // a small timeout to demo the loading state
	        setTimeout(function() {
	            $scope.loadIdeaData();
	        }, 1000);
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

			$scope.currentPageNumber++;
			DeedService.getToDeeds($scope.currentPageNumber).then(function(data){
				$scope.feedSuccess = true;

				SwipeToReloadService.slideUp();
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

			DeedService.getToDeeds(1).then(function(data){
				//always reset the page number onload
				$scope.currentPageNumber = 1;
				$scope.feedLoading = false;
				$scope.feedSuccess = true;

				SwipeToReloadService.slideUp();
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
]);;
welldonegoodServices.service('DeedService', ['HTTPService', '$q',
	function(HTTPService, $q) {
		var deedService = {};

		deedService.getDeedFeed = function(currentPageNumber) {
			return HTTPService.get(welldonegoodEndpoints.deedFeedLocation + '&page=' + currentPageNumber);
		};

		deedService.getToDeeds = function(currentPageNumber) {
			return HTTPService.get(welldonegoodEndpoints.deedIdeaLocation + '&page=' + currentPageNumber);
		};

		deedService.getAllToDeeds = function(currentPageNumber) {
			if (!currentPageNumber && currentPageNumber !== 1) {
				currentPageNumber = 1;
			}

			var getAllToDeedsDeferred = $q.defer();

			deedService.getToDeeds(currentPageNumber).then(function(toDeeds){
				if (toDeeds) {
					if (toDeeds.pages > currentPageNumber) {
						currentPageNumber++;
						deedService.getAllToDeeds(currentPageNumber).then(function(nestedToDeeds){
							toDeeds.posts = toDeeds.posts.concat(nestedToDeeds.posts);
							console.log(toDeeds.posts.length)
							getAllToDeedsDeferred.resolve(toDeeds);	
						});
					} else {
						getAllToDeedsDeferred.resolve(toDeeds);	
					}
				} else {
					getAllToDeedsDeferred.resolve(false);
				}
			});

			return getAllToDeedsDeferred.promise;
		};

		deedService.postToDeed = function(deed) {
			var deedInformation = [
			"title=ToDeed: " + deed.title,
			"content=" + deed.content,
			"status=publish",
			"categories=deedinspirations"
			];

			var config = {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			};

			var deedSubmitString = deedInformation.join('&');

			return HTTPService.noncePost(welldonegoodEndpoints.createPost, config, deedSubmitString);
		}

		deedService.getCompletedDeeds = function(currentPageNumber) {
			return HTTPService.getNested(welldonegoodEndpoints.userInformation, function(url, userData){
				return welldonegoodEndpoints.completedDeedLocation + '&author_id=' + userData.id +  '&page=' + currentPageNumber;
			});
		};

		deedService.postDeed = function(photoLocation, deed) {
			var params = {};        
            params.title = "Deed:" + deed.title;
            params.content = deed.content;
            params.status = "publish";
            params.categories = "deeds"

			return HTTPService.postPhoto(welldonegoodEndpoints.createPost, photoLocation, params);
        }

		return deedService;
	}
]);
;
welldonegoodServices.service('HTTPService', ['$http', '$q',
	function($http, $q) {
		var httpService = {};

     httpService.get = function(url) {
      var httpDeferred = $q.defer();
      $http.get(url)
      .success(function(data) {
            console.log(url,data);
            httpDeferred.resolve(data);
      })
      .error(function(data) {
            httpDeferred.resolve(false);
      });

      return httpDeferred.promise;
  };

        //Takes a url, as well as a function to create the second call
        //urlNestedFunction will be passed the original url as well as the response data
        httpService.getNested = function(url, urlNestedFunction) {
            var httpDeferred = $q.defer();
            $http.get(url)
            .success(function(responseData){
                var url2 = urlNestedFunction(url, responseData);
                $http.get(url2)
                .success(function(data) {
                    // console.log(url, responseData, data,url2);
                    httpDeferred.resolve(data);
                })
                .error(function(data) {
                    httpDeferred.resolve(false);
                });
            })
            .error(function(data){
                httpDeferred.resolve(false);
            });

            return httpDeferred.promise;
        };

        httpService.noncePost = function(url, config, data) {
            var httpDeferred = $q.defer();

            $http.get(welldonegoodEndpoints.nonceLocation)
            .success(function(noonceData,status, header) {
                var nonceResponse = angular.fromJson(noonceData.substring(2, noonceData.length-1));

                if (data) {
                    data += "&nonce=" + nonceResponse.nonce;    
                } else {
                    data = "nonce=" + nonceResponse.nonce;
                }

                console.log(data);

                $http.post(url, data, config)
                .success(function(data, status, header) {
                    console.log(data, status, header)
                    httpDeferred.resolve(data);
                })
                .error(function(data) {
                    httpDeferred.resolve(false);
                });
            })
            .error(function(data) {
                httpDeferred.resolve(false);
            }); 

            return httpDeferred.promise;
        }

        httpService.postPhoto = function(url, photoLocation, params) {
            var httpDeferred = $q.defer();

            $http.get(welldonegoodEndpoints.nonceLocation)
            .success(function(data,status, header) {
                var nonceResponse = angular.fromJson(data.substring(2, data.length-1));

                var options = new FileUploadOptions();
                options.fileKey="attachment";
                options.fileName=photoLocation.substr(photoLocation.lastIndexOf('/')+1);
                options.mimeType="image/jpeg";

                if (params) {
                    params.nonce = nonceResponse.nonce;
                } else {
                    params = {nonce: nonceResponse.nonce};
                }
                
                options.params = params;

                var ft = new FileTransfer();
                ft.upload(photoLocation, encodeURI(url), function(r) {
                    httpDeferred.resolve(angular.fromJson(r.response));
                }, function(error){
                    httpDeferred.resolve(false);
                }, options);
            })
            .error(function(data) {
                httpDeferred.resolve(false);
            });

            return httpDeferred.promise;
        }

        return httpService;
    }
    ]);
;
welldonegoodServices.service('PhotoService', ['$http', '$q',
    function($http, $q) {
            var pictureSource;   // picture source
            var destinationType; // sets the format of returned value

            var PhotoService = {
                init: function() {
                    pictureSource=navigator.camera.PictureSourceType;
                    destinationType=navigator.camera.DestinationType;    
                },
                capturePhotoEdit: function() {
                    var photo = $q.defer();
                    if(!pictureSource || !destinationType) {
                        this.init();
                    }
                    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
                    navigator.camera.getPicture(function(imageData) {
                        // photo.resolve("data:image/jpeg;base64," + imageData);
                        photo.resolve(imageData);
                    }, function(error) {
                        if (error.indexOf("cancelled") == -1) {
                            alert(error);
                        }

                        photo.reject();
                    }, { quality: 90, allowEdit: true,
                        destinationType: destinationType.FILE_URI,
                        saveToPhotoAlbum: true });

                    return photo.promise;
                },
                getPhoto: function() {
                    var photo = $q.defer();
                    
                    if(!pictureSource || !destinationType) {
                        this.init();
                    }

                    // Retrieve image file location from specified source
                    navigator.camera.getPicture(function(imageData) {
                        photo.resolve(imageData);
                    }, function(error) {
                        if (error.indexOf("cancelled") == -1) {
                            alert(error);
                        }

                        photo.reject();
                    }, { quality: 90, allowEdit: false,
                        destinationType: destinationType.FILE_URI,
                        sourceType: pictureSource.SAVEDPHOTOALBUM });

                    return photo.promise;
                }
            }

            return PhotoService;            
        }]);;
welldonegoodServices.service('SwipeToReloadService', [
	function() {
		var SwipeToReloadService = {};

		SwipeToReloadService.init = function(container, slidebox, slidebox_icon, scroll_content, handler) {
			SwipeToReloadService.container = SwipeToReloadService.getEl(container);
			SwipeToReloadService.slidebox = SwipeToReloadService.getEl(slidebox);
			SwipeToReloadService.slidebox_icon = SwipeToReloadService.getEl(slidebox_icon);
			SwipeToReloadService.scroll_content = SwipeToReloadService.getEl(scroll_content);
			SwipeToReloadService.handler = handler;

			SwipeToReloadService.breakpoint = 80;

			SwipeToReloadService._slidedown_height = 0;
            SwipeToReloadService._anim = null;
            SwipeToReloadService._dragged_down = false;

            SwipeToReloadService.hammertime = Hammer(SwipeToReloadService.container)
                .on("touch dragdown release", function(ev) {
                    SwipeToReloadService.handleHammer(ev);
                });
		}

		SwipeToReloadService.handleHammer = function(ev) {
            switch(ev.type) {
                // reset element on start
                case 'touch':
                    SwipeToReloadService.hide();
                    break;

                // on release we check how far we dragged
                case 'release':
                    if(!SwipeToReloadService._dragged_down) {
                        return;
                    }

                    // cancel animation
                    try {
                        cancelAnimationFrame(SwipeToReloadService._anim);    
                    } catch (error) {
                        console.log(error);
                    }

                    // over the breakpoint, trigger the callback

                    if(ev.gesture.deltaY >= SwipeToReloadService.breakpoint) {
                        SwipeToReloadService.container.className = 'pullrefresh-loading full-height';
                        SwipeToReloadService.slidebox_icon.className = 'icon loading';

                        SwipeToReloadService.setHeight(60);
                        SwipeToReloadService.handler.call(SwipeToReloadService);
                    }
                    // just hide it
                    else {
                        SwipeToReloadService.slidebox.className = 'slideup';
                        SwipeToReloadService.container.className = 'pullrefresh-slideup full-height';

                        SwipeToReloadService.hide();
                    }
                    break;

                // when we dragdown
                case 'dragdown':
                    // if we are not at the top move down
                    if(SwipeToReloadService.scroll_content.scrollTop > 15) {
                        return;
                    } 

                    SwipeToReloadService._dragged_down = true;

                    // no requestAnimationFrame instance is running, start one
                    if(!SwipeToReloadService._anim) {
                        SwipeToReloadService.updateHeight();
                    }

                    // stop browser scrolling
                    ev.gesture.preventDefault();

                    // update slidedown height
                    // it will be updated when requestAnimationFrame is called
                    SwipeToReloadService._slidedown_height = ev.gesture.deltaY * 0.4;
                    break;
            }
        };

        SwipeToReloadService.setHeight = function(height) {
            SwipeToReloadService.container.style.transform = 'translate3d(0,'+height+'px,0) ';
            SwipeToReloadService.container.style.oTransform = 'translate3d(0,'+height+'px,0)';
            SwipeToReloadService.container.style.msTransform = 'translate3d(0,'+height+'px,0)';
            SwipeToReloadService.container.style.mozTransform = 'translate3d(0,'+height+'px,0)';
            SwipeToReloadService.container.style.webkitTransform = 'translate3d(0,'+height+'px,0) scale3d(1,1,1)';
        };

        SwipeToReloadService.hide = function() {
            SwipeToReloadService.container.className = ' full-height';
            SwipeToReloadService._slidedown_height = 0;
            SwipeToReloadService.setHeight(0);

            try {
                cancelAnimationFrame(SwipeToReloadService._anim);    
            } catch (error) {
                console.log(error);
            }

            SwipeToReloadService._anim = null;
            SwipeToReloadService._dragged_down = false;
        };

        SwipeToReloadService.slideUp = function() {
            try {
                cancelAnimationFrame(SwipeToReloadService._anim);    
            } catch (error) {
                console.log(error);
            }
            
            SwipeToReloadService.slidebox.className = 'slideup';
            SwipeToReloadService.container.className = 'pullrefresh-slideup full-height';

            SwipeToReloadService.setHeight(0);
            setTimeout(function() {
                SwipeToReloadService.hide();
            }, 500);
        };

        SwipeToReloadService.updateHeight = function() {

            SwipeToReloadService.setHeight(SwipeToReloadService._slidedown_height);

            if(SwipeToReloadService._slidedown_height >= SwipeToReloadService.breakpoint){
                SwipeToReloadService.slidebox.className = 'pull-to-reload-box breakpoint';
                SwipeToReloadService.slidebox_icon.className = 'icon arrow arrow-up';
            }
            else {
                SwipeToReloadService.slidebox.className = 'pull-to-reload-box';
                SwipeToReloadService.slidebox_icon.className = 'icon arrow';
            }

            SwipeToReloadService._anim = requestAnimationFrame(function() {
                SwipeToReloadService.updateHeight();
            });
        };

        SwipeToReloadService.getEl = function(id) {
        	return document.getElementById(id);
    	}


		return SwipeToReloadService;
	}
]);;
welldonegoodApp.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        //This is dirty but it works...
        //If the node count has passed the "getItemsLoaded" count
        //AND the screen isn't filled up yet
        //Call the scrolled function to load more data
        var nodeCount = 0;
        elm.bind('DOMNodeInserted', function(event){
        	nodeCount++;
        	//Each node is counted twice on insert
        	if (scope.getItemsLoaded() * 2 <= nodeCount) {
        		nodeCount = 0;
        		if (raw.scrollHeight <= raw.offsetHeight) {
        			var scrollFunction = scope[attr.whenScrolled.replace("()","")];
                    scrollFunction();
        		}
        	}

    	});
        
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});