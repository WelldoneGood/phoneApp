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
