welldonegoodServices.service('HTTPService', ['$http', '$q',
	function($http, $q) {
		var httpService = {};

     httpService.get = function(url) {
      var httpDeferred = $q.defer();
      $http.get(url)
      .success(function(data) {
            //console.log(url,data);
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
                    //console.log(url, responseData, data,url2);
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

                //console.log(data);

                $http.post(url, data, config)
                .success(function(data, status, header) {
                    //console.log(data, status, header)
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
