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
