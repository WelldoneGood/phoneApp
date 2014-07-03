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
        }]);